import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Format dates cleanly for the frontend
      const { rows } = await sql`SELECT id, wid, type, TO_CHAR("from", 'YYYY-MM-DD') as from, TO_CHAR("to", 'YYYY-MM-DD') as to, days, note FROM leaves ORDER BY "from" DESC`;
      return res.status(200).json(rows);
    } 
    
    if (req.method === 'POST') {
      const { wid, type, from, to, days, note } = req.body;
      const { rows } = await sql`
        INSERT INTO leaves (wid, type, "from", "to", days, note) 
        VALUES (${wid}, ${type}, ${from}, ${to}, ${days}, ${note}) RETURNING *`;
      return res.status(201).json(rows[0]);
    } 
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM leaves WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
