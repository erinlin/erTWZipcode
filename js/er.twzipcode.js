/* Author: Erin Lin. erinylin.blogspot.com MIT 2018*/
const erTWZipcode = (opt = {}) => {
  const $sel = (el) => document.querySelector(el);
  const {
    countySelector,
    districtSelector,
    zipcodeSelector,
    defaultCountyText,
    defaultDistrictText,
    // onCountyChanged,
    // onDistrictChanged
  } = opt;
  
  const clist = Object.keys(__tw_zipcode);
  clist.unshift( [defaultCountyText  || "縣市", ""] );

  const isArray = (arr) => {
    return arr instanceof Array;
  }

  const setOptions = (arr, target) => {
    arr.map(o => {
      if (isArray(o)) {
        return new Option(o[0], o[1]);
      }else{
        return new Option(o, o);
      }
    })
    .forEach(o => target.options.add(o));
    target.options[0].selected = true;
    target.options[0].disabled = true;
    // target.options[0].hidden = true;
  }

  const selectEl = $sel(countySelector || "select[name=county]");
  const distEl = $sel(districtSelector  || "select[name=district]");
  let zipcodeEl = $sel(zipcodeSelector  || "input[name=zipcode]");;
  if (selectEl != null) {
    setOptions(clist, selectEl);
  }else{
    console.error("erTWZipcode ERROR: county 可能拼錯了呦，不然設一下 selectors")
    //does not have county select, dont need to do after.
    return;
  }
  let showCode = distEl.getAttribute("zipcode-align");
  showCode = showCode === "left" ? 1 : showCode === "right" ? 2 : 0
  let distlist;

  function setDistlist(v){
    distlist = __tw_zipcode[v];
    distEl.options.length = 0;
    if (distlist) {
      let temp = Object.keys(distlist)
        .map(key => {
          return showCode === 1 ? [distlist[key] + " " + key, key] : showCode === 2 ? [key + " " + distlist[key], key] : key;
        });
      temp.unshift([ defaultDistrictText || "鄉鎮市區", "" ]);
      setOptions(temp, distEl);
      distEl.removeAttribute('disabled');

    }else{
       setOptions([defaultDistrictText || "鄉鎮市區", ""], distEl);
       distEl.setAttribute('disabled', 'disabled');
    }
  }
  // selectEl.onchange = (evt) => {
  selectEl.addEventListener("change", (evt) => {
    zipcodeEl && (zipcodeEl.value = "");
    const o = selectEl.querySelector("option:checked");
    setDistlist(o.value);
    // onCountyChanged && onCountyChanged(evt);
  });

  distEl.addEventListener("change",(evt) => {
    const o = distEl.querySelector("option:checked");
    (distlist && zipcodeEl!=null) && (zipcodeEl.value = distlist[o.value]);
    // onDistrictChanged && onDistrictChanged(evt);
  });

  setDistlist();
}

