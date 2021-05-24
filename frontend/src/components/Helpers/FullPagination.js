 
import React , {useState,useEffect} from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Media,
    Col,FormGroup,Input,Button
} from "reactstrap";

import ReactPaginate from 'react-paginate';

function FullPagination(props) {
 const {totalDocs,totalPages,page,hasPreviousPage,hasNextPage,goToPage,changePage} = props;
    console.log(totalPages)


        return(<CardFooter className="py-4">
        <nav className="justify-content-center mb-0" aria-label="...">
        <ReactPaginate className="justify-content-center mb-0"
          previousLabel={''}
          nextLabel={''}
          breakLabel={'...'}
        containerClassName="pagination pagination justify-content-center mb-0"
          breakClassName={'break-me'}
          pageClassName="page-item"
          pageLinkClassName="page-link"
               activeClassName="active"
               disabledClassName="disabled"
               previousLinkClassName="page-link fas fa-angle-left"
               nextLinkClassName="page-link fas fa-angle-right"
          previousClassName="page-item"
          nextClassName="page-item"
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={changePage}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />     
        </nav>                                      
        </CardFooter>
                );
}

export default FullPagination;
