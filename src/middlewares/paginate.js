
export const pagination= async (totalProducts, limit, page, query, sort)=>{
  
    
   let total_pages =Math.ceil(totalProducts/limit)// obtenemos el numero de paginas dividiendo el total de docs entre el limite que le pongamos, ya que el limit so los que vamos a ver 
      if (total_pages === 0 ){total_pages = 1}//abarcamos el caso qeu en la division nos de 0, y le asignamos 1 ya que solo tendremos esa pagina 
   let actual_page = page;
      if (actual_page>total_pages || actual_page < 1){throw new Error("the page can't be major as total_pages or minor to 0")}
    const prev_page=(actual_page === 1 )? null : actual_page -1;
    const next_page= (actual_page < total_pages) ? actual_page + 1 : null;
    const has_prev_page= ( prev_page === null) ? false : true;
    const has_next_page= ( next_page === null) ? false : true;

    let validate_query = query;
      if (query===undefined) 
         {validate_query = ''};
    let validate_sort = sort;
      if(sort===undefined)
         {validate_sort = ''}
    const prev_link= has_prev_page ? `/api/products?limit=${limit}&page=${prev_page}&query=${validate_query}&sort${validate_sort}`: null;
    const next_link= has_next_page ? `/api/products?limit=${limit}&page=${next_page}&query=${validate_query}&sort${validate_sort}` : null;

  return (
   {
      total_pages:total_pages,
      actual_page:page,
      prev_page:prev_page,
      next_page:next_page,
      has_prev_page:has_prev_page,
      has_next_page:has_next_page,
      prev_link:prev_link,
      next_link:next_link
   
   })
  
}







