-- Migration to seed default categories for Myark
INSERT INTO categories (slug, label, icon_name, bg_color, text_color, sort_order)
VALUES 
  ('scholarships', 'Scholarships', '🎓', '#f1f8ff', '#000000', 1),
  ('olympiads', 'Olympiads', '🏅', '#f1f8ff', '#000000', 2),
  ('robotics', 'Robotics', '🤖', '#f1f8ff', '#000000', 3),
  ('sports', 'Sports', '⚽', '#f1f8ff', '#000000', 4),
  ('innovation', 'Innovation', '💡', '#f1f8ff', '#000000', 5),
  ('creativity', 'Creativity', '🎨', '#f1f8ff', '#000000', 6),
  ('coding', 'Coding', '💻', '#f1f8ff', '#000000', 7)
ON CONFLICT (slug) DO NOTHING;
