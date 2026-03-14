import { InfinitySpin } from "react-loader-spinner";
import css from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={css.loaderWrapper}>
      <InfinitySpin width="200" color="#4fa94d" />
    </div>
  );
};

export default Loader;
