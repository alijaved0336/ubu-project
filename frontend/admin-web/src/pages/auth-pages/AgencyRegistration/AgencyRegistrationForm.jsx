import { Checkbox, Col, Flex, Form, Input, Radio, Row, Typography } from "antd"

import './AgencyRegistrationForm.less'

const AgencyRegistrationForm = ({
    useForm,
    onSubmit
}) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm
    const { Text } = Typography
    const productCategories = [
        "Accessories", "Baby/Kids", "Beauty", "Beauty - Makeup", "Beauty - Skincare", "Bridal",
        "Consumer Packaged Goods", "Electronics", "Entertainment", "Enterprise",
        "Fashion", "Fast Fashion", "Food & Beverage", "Handbags", "Health & Wellness",
        "Home", "Home - Kitchen", "Intimates", "Jewelry", "Lifestyle", "Luxury",
        "Luxury - Children", "Mens", "Multi-Brand", "Other", "Personal Care", "Pets",
        "Shoes", "Subscription Services", "Sustainable", "Toys", "Travel"
    ];
    const budgetCategories = [
        "$0-$99,999", "$100,000-$499,999","$500,000-$999,999","$1,000,000-$4,999,999","$5,000,000-$9,999,999","$10,000,000-$24,999,999","$25,000,000-$49,999,999","$50,000,0000",
    ]
    const affiliateNetwork = [
        "Not in a network",
        "CJ Affiliate (Commission Junction)",
        "FlexOffers",
        "Partnerize",
        "Sovrn //Commerce",
        "Avantlink",
        "Commission Factory",
        "Impact",
        "Pepperjam (Ascend by Partnerize)",
        "Tradedoubler",
        "Avangate Affiliate Network",
        "eBay Partner Network",
        "Linkprice",
        "Rakuten Advertising",
        "Webgains",
        "Awin",
        "Affiliation",
        "Netaffiliation (Kwanko)",
        "ShareASale",
        "Other"
    ];


    return <>
        <Form
            className="brand-form"
            onFinish={handleSubmit(onSubmit)}
        >
            <Flex vertical className="brand-flex" gap='large'>
                <Flex gap="middle" vertical className="brand-f">
                    <Flex gap='large' justify="end" align="center" className="brand-f-f1">
                        <Input className="input" placeholder="First Name*" />
                        <Input className="input" placeholder="Last Name*" />
                    </Flex>
                    <Flex gap='large' justify="end" align="center" className="brand-f-f1">
                        <Input className="input" placeholder="Company Name*" />
                        <Input className="input" placeholder="Email*" />
                    </Flex>
                    <Flex gap='large' justify="end" align="center" className="brand-f-f1">
                        <Input className="input" placeholder="Agency Name*" />
                        <Input className="input" placeholder="What Brand are you applying on behalf of*" />
                    </Flex>
                    <Flex gap='large' justify="end" align="center" className="brand-f-f1">
                        <Input className="input" placeholder="Company Website*" />
                        <Input className="input" placeholder="Brnad Website*" />
                    </Flex>
                    <Flex gap='large' justify="end" align="center" className="brand-f-f1">
                        <Input className="input" placeholder="Country/Region*" />
                        <Input className="input" placeholder="Brand Instagram handle*" />
                    </Flex>
                    <Flex gap='large' justify="end" align="center" className="brand-f-f2">
                        <Input className="input" placeholder="Brnad Annual Online Sale*" />
                    </Flex>

                </Flex>
                <Flex vertical className="brand-cbs" gap='large'>
                    <Flex>
                        <Text className="brand-cbs-text">Product Category*</Text>
                    </Flex>
                    <Flex  className="brand-cbs-row">
                        <Checkbox.Group>
                            {productCategories.map(category => (
                                <Flex key={category} className="brand-cbs-item" >
                                    <Checkbox className="brand-cbs-row-cb" value={category}>{category}</Checkbox>
                                </Flex>
                            ))}
                        </Checkbox.Group>
                    </Flex>
                </Flex>
                <Flex vertical className="brand-radio" gap='small'>
                    <Flex>
                        <Text className="brand-radio-text">Please Select</Text>
                    </Flex>
                    <Flex   >
                        <Radio.Group className="brand-radio-row">
                            {budgetCategories.map(category => (
                                <Flex key={category} className="brand-radio-item" >
                                    <Radio className="brand-radio-row-cb" value={category}>{category}</Radio>
                                </Flex>
                            ))}
                        </Radio.Group>
                    </Flex>
                </Flex>
                <Flex vertical className="brand-radio2" gap='small'>
                    <Flex>
                        <Text className="brand-radio2-text">Brand affiliate network</Text>
                    </Flex>
                    <Flex   >
                        <Radio.Group className="brand-radio2-row">
                            {affiliateNetwork.map(category => (
                                <Flex key={category} className="brand-radio2-item" >
                                    <Radio className="brand-radio2-row-cb" value={category}>{category}</Radio>
                                </Flex>
                            ))}
                        </Radio.Group>
                    </Flex>
                </Flex>
            </Flex>
        </Form>
    </>
}

export default AgencyRegistrationForm