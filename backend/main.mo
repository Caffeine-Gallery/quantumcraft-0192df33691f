import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

actor WebsiteBuilder {
    type Website = {
        content: Text;
        published: Bool;
    };

    let websites = HashMap.HashMap<Principal, Website>(10, Principal.equal, Principal.hash);

    public shared(msg) func saveWebsite(websiteData : Text) : async Result.Result<(), Text> {
        let caller = msg.caller;
        let website : Website = {
            content = websiteData;
            published = false;
        };
        websites.put(caller, website);
        #ok()
    };

    public shared(msg) func publishWebsite() : async Result.Result<Text, Text> {
        let caller = msg.caller;
        switch (websites.get(caller)) {
            case (null) {
                #err("No website found for the user")
            };
            case (?website) {
                let updatedWebsite : Website = {
                    content = website.content;
                    published = true;
                };
                websites.put(caller, updatedWebsite);
                #ok(Text.concat("https://example.com/", Principal.toText(caller)))
            };
        }
    };

    public shared(msg) func getCurrentWebsite() : async Result.Result<Text, Text> {
        let caller = msg.caller;
        switch (websites.get(caller)) {
            case (null) {
                #err("No website found for the user")
            };
            case (?website) {
                #ok(website.content)
            };
        }
    };

    public query func getPublishedWebsites() : async [(Principal, Text)] {
        Array.mapFilter<(Principal, Website), (Principal, Text)>(
            Iter.toArray(websites.entries()),
            func ((principal, website)) {
                if (website.published) {
                    ?((principal, website.content))
                } else {
                    null
                }
            }
        )
    };
}
