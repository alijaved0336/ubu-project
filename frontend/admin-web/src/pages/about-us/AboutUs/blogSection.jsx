import { Text } from "@src/components";
import BlogImage1 from "@src/assets/blog-image1.png";
import BlogImage2 from "@src/assets/blog-image2.png";
import BlogImage3 from "@src/assets/blog-image3.png";
import Container from "@src/components/Common/Container/Container";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";

const BlogSection = () => {
  return (
    <Container className="xl:tw-max-w-[calc(100%-188px)] tw-mx-auto">
      <div className="tw-mt-8 lg:tw-mt-12  tw-mb-20">
        <div className="tw-col-span-10 tw-mt-8 tw-mb-6 lg:tw-mb-8">
          <Text className="tw-text-[1.75rem] sm:tw-text-[2.25rem] lg:tw-text-[3.125rem] ff-classy tw-font-normal">
            What’s New in the World of <br /> UBU?
          </Text>
        </div>

        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-4 tw-mt-6">
          <ReactImage
            src={BlogImage1}
            loading="lazy"
            blurHash="LjGu8#u4-Vb]~WkqsCkW%NayV@kW"
            containerClassName="lg:tw-col-span-2"
            className="tw-rounded-md tw-w-full tw-h-auto tw-aspect-[812/467]"
          />
          <div className="tw-grid lg:tw-grid-cols-1 md:tw-grid-cols-2 tw-grid-cols-1 tw-w-full tw-h-full tw-gap-4 md:tw-gap-2 tw-col-span-1">
            <ReactImage
              src={BlogImage2}
              loading="lazy"
              blurHash="L8D]bu_20L?F~A_3bve.00-o?vtR"
              className="tw-rounded-md tw-w-full tw-h-auto tw-aspect-[419/222]"
            />

            <ReactImage
              src={BlogImage3}
              loading="lazy"
              blurHash="LMGH}D~WPA%h.S-=%MxtNGtR%Mad"
              className="tw-w-full tw-rounded-md tw-h-auto tw-aspect-[419/222]"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
export default BlogSection;
