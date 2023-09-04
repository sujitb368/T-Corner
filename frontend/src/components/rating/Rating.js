import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
function Rating(props) {
  console.log("rating component");
  //this state value is used to let user give star in their order page
  const [giveStar, setGiveStar] = useState(false);
  //this state value will store  start given by user
  const [givenStar, setGivenStar] = useState(null);
  //this state value holds total star of this product
  const [fullStarLocation, setFullStarLocation] = useState(null);
  const [halfStarLocation, setHalfStarLocation] = useState(null);

  //custom array of length 5 to loop through
  const startArray = Array.from({ length: 5 });

  const ratingFunction = (rate) => {
    setGivenStar(rate);
  };

  useEffect(() => {
    setGiveStar(props.giveStar);
    // setTotalStar(props.totalStar);
  }, []);
  const totalStar = props.totalStar;
  useEffect(() => {
    setFullStarLocation(Math.floor(totalStar));
    setHalfStarLocation(totalStar % 1 >= 0.5 ? fullStarLocation + 1 : null);
  }, [totalStar]);
  return (
    <>
      {/* display full star, half star, blank star  */}
      <Row>
        <i>
          {!giveStar &&
            totalStar > 0 &&
            startArray.map((star, index) => {
              return index + 1 <= fullStarLocation ? (
                <BsStarFill className="text-2" key={index} />
              ) : halfStarLocation === index + 1 ? (
                <BsStarHalf className="text-2" key={index} />
              ) : (
                <BsStar key={index} />
              );
            })}

          {giveStar &&
            startArray.map((star, index) => {
              return givenStar !== null && index + 1 <= givenStar ? (
                <BsStarFill key={index} />
              ) : (
                <BsStar
                  key={index}
                  onClick={(e) => ratingFunction(index + 1)}
                />
              );
            })}
        </i>
      </Row>
    </>
  );
}

export default Rating;
