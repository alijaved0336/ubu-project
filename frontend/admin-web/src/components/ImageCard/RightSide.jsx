import { Button, Flex } from "antd"
import './ImageCard.less'
import Img from '../../assets/code-circle.png'
import Img2 from "../../assets/global.png"
function RightImageCard({imgSrc, className, btnText, align}){
    return(
        
        <Flex vertical   align={align}>
        <div className="main-container-1">
        <img src={imgSrc}  className={`${className} `}/>
        </div>
        <Flex className="btn-container-1" align="start" justify="center">

        <Button size='large' className="btn-container-12" icon={ <img src={btnText==="Brands"?Img2:Img} />}>{btnText}</Button>
        </Flex>
        </Flex>
    )
}
export default RightImageCard