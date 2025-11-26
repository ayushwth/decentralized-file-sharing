import { useState } from "react";
import "./Display.css";
const Display = ({sendCountToParent, contract, account }) => {
  const [data, setData] = useState("");
  const [place,setPlace]=useState(true);
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      // console.log(str);
      // console.log(str_array);
      sendCountToParent(str_array.length);
      const images = str_array.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank">
            <img
              key={i}
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt={i+1}
              className="image-list"
            ></img>
          </a>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };
  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder={place?"Enter Address":""}
        className="address"
        onFocus={()=>{setPlace(false);}}
        onBlur={()=>{setPlace(true)}}
      ></input>
      <button className="center button" onClick={()=>{getdata()}}>
        Get Data
      </button>
    </>
  );
};
export default Display;
