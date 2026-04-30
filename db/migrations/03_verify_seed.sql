-- Verification Queries
-- Sprint 1 | M3 DB Engineer

-- Check row counts
SELECT 'customer' as table_name, COUNT(*) as row_count FROM customer
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'salesdetail', COUNT(*) FROM salesdetail
UNION ALL
SELECT 'product', COUNT(*) FROM product
UNION ALL
SELECT 'pricehist', COUNT(*) FROM pricehist
UNION ALL
SELECT 'rights', COUNT(*) FROM rights
UNION ALL
SELECT 'Module', COUNT(*) FROM "Module";

-- Check SUPERADMIN rights
SELECT u.username, u.user_type, r.rightCode, umr.right_value
FROM "user" u
JOIN "UserModule_Rights" umr ON u.userid = umr.userid
JOIN rights r ON umr.rightCode = r.rightCode
WHERE u.user_type = 'SUPERADMIN';