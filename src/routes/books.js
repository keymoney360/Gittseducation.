router.get("/:id/download", requireAuth, async (req, res) => {
  const owns = await Order.exists({ user: req.session.userId, status: "paid", "items.book": req.params.id });
  if (!owns) return res.status(403).json({ error: "Purchase required." });
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found." });
  if (book.pdfUrl.startsWith("/private/")) { const filePath = path.join(__dirname, "../../uploads", path.basename(book.pdfUrl)); return res.download(filePath, `${book.title.replace(/[^a-z0-9-_]/gi, "_")}.pdf`); } return res.redirect(book.pdfUrl);
});
module.exports = router;
