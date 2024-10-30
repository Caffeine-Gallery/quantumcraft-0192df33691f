import Int "mo:base/Int";

import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";

actor WebsiteBuilder {
    stable var websites : [Text] = [];
    stable var currentWebsite : Text = "";

    // Save the current website
    public shared(msg) func saveWebsite(websiteData : Text) : async Result.Result<(), Text> {
        currentWebsite := websiteData;
        #ok()
    };

    // Publish the current website
    public shared(msg) func publishWebsite() : async Result.Result<Text, Text> {
        if (Text.size(currentWebsite) == 0) {
            #err("Error: No website data to publish")
        } else {
            let websiteId = Text.concat("website_", Int.toText(Array.size(websites)));
            websites := Array.append(websites, [currentWebsite]);
            #ok(Text.concat("https://example.com/", websiteId))
        }
    };

    // Get all published websites
    public query func getPublishedWebsites() : async [Text] {
        websites
    };

    // Get the current website data
    public query func getCurrentWebsite() : async Text {
        currentWebsite
    };
}
