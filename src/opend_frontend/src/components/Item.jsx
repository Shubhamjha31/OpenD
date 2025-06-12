import React, { useEffect, useState } from "react";
import logo from "../../public/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token_backend";
import Button from "./Button";
import { opend_backend } from "../../../declarations/opend_backend";
import CURRENT_USER_ID from "../main";
import PriceLabel from "./PriceLabel";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState(logo);
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setShouldDisplay] = useState(true);

  const id = props.id;

  // fetching the canister to IC By HTTP protocol
  const localHost = "http://127.0.0.1:4943/";
  const agent = new HttpAgent({host: localHost});
  // if you are using the local replica, you need to fetch the root key
  agent.fetchRootKey();

  let NFTActor;

  async function fetchNft() {
    await agent.fetchRootKey();
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    // it will convert [Nat8] to Uint8Array which can be used as image source
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    if (props.role === "collection") {
      const nftIsListed = await opend_backend.isListed(props.id);
      console.log("nftIsListed:", nftIsListed);

      if(nftIsListed){
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" });
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"} />);
      }
    } else if (props.role === "discover"){
      const originalOwner = await opend_backend.getOriginalOwner(props.id);
      if(originalOwner.toText() !== CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend_backend.getListedPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />)
      
    }
  }

  useEffect(() => {
    fetchNft();
  }, [])

  let price;
  function handleSell() {
    console.log("Sell button clicked");
    setPriceInput(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => {
          price = e.target.value;
        }}
      />);
      setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)"});
    setLoaderHidden(false);
    console.log("Sell price is: " + price);
    const listingResult = await opend_backend.listItem(props.id, Number(price));
    console.log("Sell result: ", listingResult);
    if(listingResult == "Succes") {
      const opendId = await opend_backend.getOpenDCanisterId();
      const transferResult = await NFTActor.transferOwnerShip(opendId);
      console.log("Transfer result: ", transferResult);
      if(transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setSellStatus("Listed");
      }
    }
  }


  async function handleBuy(){
    console.log("Buy button triggered");
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("vu5yx-eh777-77774-qaaga-cai"),
    });
    
    const sellerId = await opend_backend.getOriginalOwner(props.id);
    const itemPrice = await opend_backend.getListedPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    if (result === "Success") {
      const transferResult = await opend_backend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("Purchase: ", transferResult);
      setLoaderHidden(true);
      setShouldDisplay(false);
    }
  }


  return (
    <div style={{display: shouldDisplay ? "inline" : "none"}} className="disGrid-item" >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden ={loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name} <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
