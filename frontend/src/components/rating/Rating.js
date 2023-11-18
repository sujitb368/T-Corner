import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

/**
 * Rating component for displaying and interacting with product ratings.
 * @param {Object} props - Component properties.
 * @param {number} props.totalStar - The total number of stars for the product.
 * @param {boolean} props.giveStar - Indicates whether the user can give stars.
 * @param {number} props.myRating - The user's own rating for the product.
 * @param {function} props.onClick - Callback function triggered on rating change.
 */

function Rating(props) {
  //this state value is used to let user give star in their order page
  const [giveStar, setGiveStar] = useState(false);
  //this state value will store  start given by user
  const [givenStar, setGivenStar] = useState(null);
  //this state value holds total star of this product
  const [fullStarLocation, setFullStarLocation] = useState(null);
  // State to hold the location of the half star in the total rating
  const [halfStarLocation, setHalfStarLocation] = useState(null);

  //custom array of length 5 to loop through
  const startArray = Array.from({ length: 5 });

  /**
   * Function to handle user's rating input.
   * @param {number} rate - The rating given by the user.
   */
  const ratingFunction = (rate) => {
    setGivenStar(rate);

    // Callback to parent component with the user's rating
    if (props?.onClick) {
      props.onClick(rate);
    }
  };

  // Effect to update state when props related to giving stars change

  useEffect(() => {
    setGiveStar(props.giveStar);
    setGivenStar(props.myRating);
    // setTotalStar(props.totalStar);
  }, [props.giveStar, props.myRating]);
  const totalStar = props.totalStar;

  // Effect to calculate the location of full and half stars based on total rating

  useEffect(() => {
    setFullStarLocation(Math.floor(totalStar));
    setHalfStarLocation(totalStar % 1 >= 0.5 ? fullStarLocation + 1 : null);
  }, [totalStar, fullStarLocation, halfStarLocation]);
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
                <BsStarFill
                  style={{ fontSize: "20px", marginRight: "2px" }}
                  key={index}
                  className="text-primary"
                />
              ) : (
                <BsStarFill
                  style={{
                    color: "#e0e0e0",
                    fontSize: "20px",
                    marginRight: "2px",
                  }}
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
