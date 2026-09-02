import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT id, wid, TO_CHAR(date, 'YYYY-MM-DD') as date, type, note FROM guards ORDER BY date DESC`;
      return res.status(200).json(rows);
    } 
    
    if (req.method === 'POST') {
      const { wid, date, type, note } = req.body;
      const { rows } = await sql`
        INSERT INTO guards (wid, date, type, note) 
        VALUES (${wid}, ${date}, ${type}, ${note}) RETURNING *`;
      return res.status(201).json(rows[0]);
    } 
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM guards WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
