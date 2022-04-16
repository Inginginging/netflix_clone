import { useLocation } from "react-router-dom";

function Search() {
  //현재 url 주소를 따옴
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword"); //keword에 해당하는 param 가져옴
  return <h1>{keyword}</h1>;
}

export default Search;
