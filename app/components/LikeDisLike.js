import colors from "@/constants/colors";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function LikeDisLike(props) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Like button */}
        <TouchableOpacity onPress={props?.handleLike}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="29"
            viewBox="0 0 28 29"
            fill="none"
          >
            <Path
              d="M28 12.9652C28 12.2011 27.7318 11.4683 27.2545 10.9279C26.7771 10.3876 26.1296 10.0841 25.4545 10.0841H17.4109L18.6327 3.50061C18.6582 3.35655 18.6709 3.19809 18.6709 3.03962C18.6709 2.44899 18.4545 1.90157 18.1109 1.51261L16.7618 0L8.38727 9.47901C7.91636 10.012 7.63636 10.7323 7.63636 11.5246V25.9304C7.63636 26.6946 7.90454 27.4274 8.38191 27.9677C8.85927 28.508 9.50672 28.8116 10.1818 28.8116H21.6364C22.6927 28.8116 23.5964 28.0913 23.9782 27.0541L27.8218 16.898C27.9364 16.5667 28 16.2209 28 15.8464V12.9652ZM0 28.8116H5.09091V11.5246H0V28.8116Z"
              fill={props.liked ? colors.primary : colors.neutralGrey}
            />
          </Svg>
        </TouchableOpacity>
        {/* dislike button */}
        <TouchableOpacity onPress={props?.handleDisLike}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="29"
            viewBox="0 0 28 29"
            fill="none"
          >
            <Path
              d="M22.9091 17.287H28V0H22.9091M17.8182 0H6.36364C5.30727 0 4.40364 0.720289 4.02182 1.75751L0.178182 11.9136C0.0636363 12.2449 0 12.5907 0 12.9652V15.8464C0 16.6105 0.268181 17.3433 0.745546 17.8837C1.22291 18.424 1.87036 18.7275 2.54545 18.7275H10.5764L9.36727 25.311C9.34182 25.455 9.32909 25.5991 9.32909 25.7576C9.32909 26.3626 9.54545 26.8956 9.88909 27.2846L11.2382 28.8116L19.6127 19.3182C20.0836 18.7996 20.3636 18.0793 20.3636 17.287V2.88116C20.3636 2.11703 20.0955 1.38419 19.6181 0.843872C19.1407 0.30355 18.4933 0 17.8182 0Z"
              fill={props.disLiked ? colors.primary : colors.neutralGrey}
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default LikeDisLike;
