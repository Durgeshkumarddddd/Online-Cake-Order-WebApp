document.querySelector('.addMe').addEventListener('click', () => {
    const searchParams = new URLSearchParams(window.location.search).get(param);
    console.log(searchParams);
    
  })