sql-- M3-PR-04: customer_sales_summary SQL view
CREATE VIEW customer_sales_summary AS
SELECT c.custno, c.custname, c.payterm, c.record_status,
       COUNT(DISTINCT s.transno) AS totaltransactions,
       COALESCE(SUM(sd.quantity * ph.unitprice), 0) AS totalspend,
       MAX(s.salesdate) AS lastsaledate
FROM customer c
LEFT JOIN sales s ON s.custno = c.custno
LEFT JOIN salesdetail sd ON sd.transno = s.transno
LEFT JOIN (
  SELECT prodcode, unitprice FROM pricehist ph1
  WHERE effdate = (SELECT MAX(effdate) FROM pricehist WHERE prodcode = ph1.prodcode)
) ph ON ph.prodcode = sd.prodcode
GROUP BY c.custno, c.custname, c.payterm, c.record_status
HAVING COUNT(DISTINCT s.transno) > 0
ORDER BY totalspend DESC;
