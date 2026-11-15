import { Typography } from "antd";
import Fourth1 from "@src/assets/fourth-1.png";
import Fourth2 from "@src/assets/fourth-2.png";
import Fourth3 from "@src/assets/fourth-3.png";
import Fourth4 from "@src/assets/fourth-5.png";
import Fourth5 from "@src/assets/fourth-6.png";

import "./TrendingSection.less";

import ReactImage from "@src/components/Common/ReactImage/ReactImage";

import ReactSlick from "@src/components/Common/Carousels/ReactSlick/ReactSlick";

const trendings = [
  { image: Fourth1, blurHash: "LdLf?ryDX.rD?]$*sCE|-CNGI:i_" },
  { image: Fourth2, blurHash: "LSJ6{b}]K+555kJ6xaxaNYI.ae$*" },
  { image: Fourth3, blurHash: "LBIEnl:4~V^M=Cs.RjivDh9F%g%h" },
  { image: Fourth4, blurHash: "LRK-Uf5RD%xwMd~W_3Dioz%2SLSg" },
  { image: Fourth5, blurHash: "LCLL,WMa]^Bav_xuA1nN00Xp%1r." },
];

function FourthLandingPageComponent() {
  const { Text } = Typography;

  return (
    <div className="tw-space-y-12 p-div">
      <div className="tw-text-center">
        <Text className="flex-text">Trending & latest articles</Text>
      </div>

      <ReactSlick>
        {trendings.map((trend, index) => {
          return (
            <ReactImage
              src={trend.image}
              blurHash={trend.blurHash}
              alt={`Image ${index}`}
              key={`Image ${index}`}
              containerClassName="tw-w-full"
              className="tw-aspect-square tw-w-full"
            />
          );
        })}
      </ReactSlick>
    </div>
  );
}

export default FourthLandingPageComponent;
