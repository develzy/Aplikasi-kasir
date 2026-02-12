-- Seeding Products
INSERT INTO products (name, price, category, stock, status) VALUES ('Espresso', 15000, 'Coffee', 100, 'Tersedia');
INSERT INTO products (name, price, category, stock, status) VALUES ('Caffe Latte', 22000, 'Coffee', 45, 'Tersedia');
INSERT INTO products (name, price, category, stock, status) VALUES ('Cappuccino', 22000, 'Coffee', 60, 'Tersedia');
INSERT INTO products (name, price, category, stock, status) VALUES ('Red Velvet', 25000, 'Non-Coffee', 12, 'Stok Menipis');
INSERT INTO products (name, price, category, stock, status) VALUES ('Croissant', 18000, 'Snack', 5, 'Stok Menipis');

-- Seeding Transactions (Income)
INSERT INTO transactions (type, category, amount, date, status, note) VALUES ('income', 'Penjualan POS', 150000, '2026-02-12 10:00:00', 'Selesai', 'Order #101');
INSERT INTO transactions (type, category, amount, date, status, note) VALUES ('income', 'Penjualan POS', 45000, '2026-02-12 11:30:00', 'Selesai', 'Order #102');
INSERT INTO transactions (type, category, amount, date, status, note) VALUES ('income', 'Catering', 500000, '2026-02-11 09:00:00', 'Selesai', 'DP Catering Bu Ani');

-- Seeding Transactions (Expense)
INSERT INTO transactions (type, category, amount, date, status, note) VALUES ('expense', 'Stok Barang', 200000, '2026-02-12 08:00:00', 'Selesai', 'Beli Kopi 2kg');
INSERT INTO transactions (type, category, amount, date, status, note) VALUES ('expense', 'Listrik', 350000, '2026-02-10 14:00:00', 'Selesai', 'Tagihan PLN');
