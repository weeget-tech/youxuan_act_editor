import TextTitle from "./TextTitle/template";
import FormDemo from "./FormDemo/template";
import Space from "./Space/template";

const basicTemplate = [TextTitle, Space, FormDemo];

const BasicTemplate = basicTemplate.map((v) => {
  return { ...v, category: "base" };
});

export default BasicTemplate;
