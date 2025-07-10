-- Insert sample knowledge base entries
INSERT INTO knowledge_base (title, content, category, tags) VALUES
('Shipping Policy', 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Free shipping on orders over $50. Tracking information is provided via email once the order ships.', 'shipping', ARRAY['shipping', 'delivery', 'tracking']),

('Return Policy', 'Items can be returned within 30 days of purchase. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days. Return shipping is free for defective items.', 'returns', ARRAY['returns', 'refund', 'exchange']),

('Payment Issues', 'If payment fails but money is deducted, the transaction will be automatically reversed within 3-5 business days. Contact support if reversal takes longer. We accept all major credit cards and PayPal.', 'payment', ARRAY['payment', 'billing', 'refund']),

('Product Damage', 'If you receive a damaged product, please contact us within 48 hours with photos. We will provide a prepaid return label and send a replacement immediately. Full refund available if replacement is not desired.', 'quality', ARRAY['damage', 'defective', 'quality']),

('Account Management', 'To update your account information, log into your account dashboard. Password resets can be done via the forgot password link. Contact support for account deletion requests.', 'account', ARRAY['account', 'password', 'profile']),

('Order Tracking', 'Track your order using the tracking number sent to your email. Orders typically ship within 24 hours. If tracking shows no movement for 3+ days, contact support for investigation.', 'shipping', ARRAY['tracking', 'shipping', 'order']);
