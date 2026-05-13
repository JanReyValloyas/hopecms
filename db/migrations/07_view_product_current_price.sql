sql-- M3-PR-03: product_current_price SQL view
CREATE VIEW product_current_price AS
SELECT p.prodcode, p.description, p.unit,
       ph.unitprice, ph.effdate AS priceeffdate
FROM product p
JOIN pricehist ph ON ph.prodcode = p.prodcode
WHERE ph.effdate = (
  SELECT MAX(effdate) FROM pricehist WHERE prodcode = p.prodcode
);
