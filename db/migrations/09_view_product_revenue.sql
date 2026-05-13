sql-- Sprint 3 M3-PR-01: product_revenue SQL view
CREATE VIEW product_revenue AS
SELECT p.prodcode, p.description, p.unit,
       SUM(sd.quantity) AS totalqtysold,
       SUM(sd.quantity * ph.unitprice) AS totalrevenue
FROM product p
JOIN salesdetail sd ON sd.prodcode = p.prodcode
JOIN (
  SELECT prodcode, unitprice FROM pricehist ph1
  WHERE effdate = (SELECT MAX(effdate) FROM pricehist WHERE prodcode = ph1.prodcode)
) ph ON ph.prodcode = p.prodcode
GROUP BY p.prodcode, p.description, p.unit
ORDER BY totalrevenue DESC;
