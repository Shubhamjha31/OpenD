import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this { 
    private let itemName = name;
    private var nftOwner = owner;
    private let imageContent = content;

    public func getName(): async Text {
        return itemName;
    };

    public func getOwner(): async Principal {
        return nftOwner;
    };

    public func getAsset(): async [Nat8] {
        return imageContent;
    };

    public query func canisterId(): async Principal { 
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnerShip(newOwner: Principal): async Text {
        if (msg.caller == nftOwner) {
            nftOwner := newOwner;
            return "Success"
        } else {
            return "Error: Not the owner";
        }
    }
}