import About1 from "@src/assets/UBU-image-1.jpg";
import About2 from "@src/assets/UBU-image-2.jpg";
import About3 from "@src/assets/UBU-image-3.jpg";
import Container from "@src/components/Common/Container/Container";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";
import { Heading } from "@src/components/Common/Typography";

const ImageSection = () => {
  return (
    <Container>
      <div className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-grid-cols-1  tw-gap-3  tw-mb-10 tw-mt-3 tw-mx-3">
        <div className="tw-w-full tw-relative tw-top-0 ">
          <ReactImage
            src={About1}
            blurHash="LFE3VT-=?b_N4;%Lj]xut5oetRRj"
            className="tw-w-full tw-aspect-[3/4] tw-object-cover tw-transition-opacity"
          />

          <div className=" tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bg-white/40 tw-backdrop-blur-[2px] tw-px-8 tw-py-4">
            <Heading
              level={1}
              className=" xl:tw-text-[8.75rem] tw-text-7xl tw-font-normal "
            >
              YOU
            </Heading>
          </div>
        </div>
        <div className="tw-w-full  tw-relative tw-top-0">
          <ReactImage
            src={About2}
            blurHash="LPI}eTNG.SD%_NIURQi_-;sSM{tR"
            className="tw-w-full tw-aspect-[3/4] tw-object-cover tw-transition-opacity"
          />

          <div className=" tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bg-white/40 tw-backdrop-blur-[2px] tw-px-8 tw-py-4">
            <Heading
              level={1}
              className=" xl:tw-text-[8.75rem] tw-text-7xl tw-font-normal "
            >
              BE
            </Heading>
          </div>
        </div>
        <div className="tw-w-full  tw-relative tw-top-0  ">
          <ReactImage
            src={About3}
            blurHash="LEF5syxv*0I;4:Di4nV?FytRwvt7"
            className="tw-w-full tw-aspect-[3/4] tw-object-cover tw-transition-opacity"
          />

          <div className=" tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bg-white/40 tw-backdrop-blur-[2px] tw-px-8 tw-py-4">
            <Heading
              level={1}
              className=" xl:tw-text-[8.75rem] tw-text-7xl tw-font-normal "
            >
              YOU
            </Heading>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default ImageSection;
