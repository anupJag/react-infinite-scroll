import React, { useState, useRef, useCallback } from "react";
// import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Skelton from "@material-ui/lab/Skeleton";
import useBookSearch from "./useBookSearch";

import "./App.css";

const cssStyling = makeStyles((theme) => ({
  bodyContainer: {
    maxHeight: 520,
    overflowY: "scroll",
  },
}));

export default function App() {
  const styling = cssStyling();

  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>

      <TableContainer classes={{ root: styling.bodyContainer }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Publish Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book, index) => {
              if (books.length === index + 1) {
                return (
                  <TableRow key={book.key} ref={lastBookElementRef}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publisher}</TableCell>
                    <TableCell>{book.publishYear}</TableCell>
                  </TableRow>
                );
              } else {
                return (
                  <TableRow key={book.key}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publisher}</TableCell>
                    <TableCell>{book.publishYear}</TableCell>
                  </TableRow>
                );
              }
            })}
            {loading && (
              <TableRow>
                <TableCell>
                  <Skelton variant="text" />
                </TableCell>
                <TableCell>
                  <Skelton variant="text" />
                </TableCell>
                <TableCell>
                  <Skelton variant="text" />
                </TableCell>
                <TableCell>
                  <Skelton variant="text" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      </TableContainer>
      <div>{error && "Error"}</div>
    </>
  );
}
