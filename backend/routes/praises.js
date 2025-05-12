const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// 获取所有表扬
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('praises').select(`*, user:auth.users(*)`).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 发布新表扬
router.post('/', async (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const { content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  const { data, error } = await supabase.from('praises').insert({
    content,
    user_id: userId
  }).select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 删除表扬（仅限本人）
router.delete('/:id', async (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const { id } = req.params;

  const { data, error: fetchError } = await supabase.from('praises').select('*').match({ id }).single();

  if (fetchError || data.user_id !== userId) {
    return res.status(403).json({ error: '无权操作' });
  }

  const { error } = await supabase.from('praises').delete().match({ id });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: '删除成功' });
});

module.exports = router;
