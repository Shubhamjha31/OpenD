import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import NFTActorClass "../NFT/nft"; 
import List "mo:base/List";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";


actor OpenD {

    private type Listing = {
        itemId: Principal;
        itemPrice: Nat;
        itemOwner: Principal;
    };

    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var mapOFOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);


    public shared({caller}) func minting(name: Text, imageData: [Nat8]): async Principal {
        let owner : Principal = caller;


        let newNFT = await (with cycles = 1000_000_000_000) NFTActorClass.NFT<system>(name, owner, imageData);

        let newNFTPrincipal = await newNFT.canisterId(); 

        mapOfNFTs.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal); 

        return newNFTPrincipal;
    };

    private func addToOwnershipMap(owner: Principal, nftId: Principal){
        var ownedNFTs: List.List<Principal> = switch (mapOFOwners.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };

        ownedNFTs := List.push(nftId, ownedNFTs);
        mapOFOwners.put(owner, ownedNFTs);
    };

    public query func getNFTsByOwner(owner: Principal) : async [Principal] {
        var ownedNFTs : List.List<Principal> = switch (mapOFOwners.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        return List.toArray(ownedNFTs);
    };

    public query func getListedNFTs(): async [Principal] {
        let ids = Iter.toArray(mapOfListings.keys());
        return ids;
    };

    public shared(msg) func listItem(id: Principal, price: Nat): async Text {
        var item: NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };

        let owner = await item.getOwner();
        if (Principal.equal(owner, msg.caller)){
            let newListing: Listing = {
                itemId = id ;
                itemPrice = price;
                itemOwner = owner;
            };
            mapOfListings.put(id, newListing);
            return "Success";

        } else {
            return "You are not the owner of this NFT";
        };
    };

    public query func getOpenDCanisterId(): async Principal{
        return Principal.fromActor(OpenD);
    }; 

    public query func isListed(id: Principal): async Bool {
        if(mapOfListings.get(id) == null){
            return false;
        } else {
            return true;
        }
    };

    public query func getOriginalOwner(id: Principal): async Principal {
        var listing: Listing = switch (mapOfListings.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };
        return listing.itemOwner;
    };

    public query func getListedPrice(id: Principal): async Nat {
        var listing: Listing = switch (mapOfListings.get(id)) {
            case null return 0;
            case (?result) result;
        }; 
        return listing.itemPrice;
    };

    public shared(msg) func completePurchase(id: Principal, ownerId: Principal, newOwnerId: Principal): async Text {
        var purchasedNFT: NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
            case null return "NFT does not exist";
            case (?result) result;
        };
        let transferResult = await purchasedNFT.transferOwnerShip(newOwnerId);
        if (transferResult == "Success"){
            mapOfListings.delete(id);
            var ownedNFTs : List.List<Principal> = switch (mapOFOwners.get(ownerId)){
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal): Bool {
                return listItemId != id;
            });
            addToOwnershipMap(newOwnerId, id);
            return "Success" 
        } else {
            return "Error";
        }
        
    }
 
};