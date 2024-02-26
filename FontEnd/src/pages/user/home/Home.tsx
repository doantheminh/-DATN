import CategoryTest from "@/components/category/CategoryTest";
import SliderTestDemo from "@/components/gallery/SliderTestDemo";
import ListProductItems from "@/components/products/ListItems";
import ListProductHot from "@/components/products/ListProductTest";
import { FunctionComponent } from "react";

interface HomeProps {

}

const Home: FunctionComponent<HomeProps> = () => {

    return <div>
        <SliderTestDemo />

        <div className="my-10 ">
            <CategoryTest/>
        </div>

        <div className="my-10">
            <ListProductHot />
        </div>

        <div className="my-10 ">
            <ListProductItems heading="Sản phẩm Mới" />
        </div>


    </div>
}

export default Home;