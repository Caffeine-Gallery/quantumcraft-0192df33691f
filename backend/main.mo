import Error "mo:base/Error";
import Int "mo:base/Int";

import Text "mo:base/Text";
import Array "mo:base/Array";

actor WebsiteBuilder {
    stable var websites : [Text] = [];
    stable var currentWebsite : Text = "";

    // Save the current website
    public func saveWebsite(websiteData : Text) : async () {
        currentWebsite := websiteData;
    };

    // Publish the current website
    public func publishWebsite() : async Text {
        if (Text.size(currentWebsite) == 0) {
            return "Error: No website data to publish";
        };

        let websiteId = Text.concat("website_", Int.toText(Array.size(websites)));
        websites := Array.append(websites, [currentWebsite]);

        return Text.concat("https://example.com/", websiteId);
    };

    // Get all published websites
    public query func getPublishedWebsites() : async [Text] {
        websites
    };
}
