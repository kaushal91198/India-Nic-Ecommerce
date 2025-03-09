
import Product from "../src/models/Product";
import sampleData from "./sampleProductData";
const importData = async () => {
    try {
        await Product.insertMany(sampleData);
    } catch (error) {
        console.log(error);
    }
};


export default importData