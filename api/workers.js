import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM workers ORDER BY id ASC`;
      return res.status(200).json(rows);
    } 
    
    if (req.method === 'POST') {
      const { fname, lname, dept, pos, hire } = req.body;
      const { rows } = await sql`
        INSERT INTO workers (fname, lname, dept, pos, hire) 
        VALUES (${fname}, ${lname}, ${dept}, ${pos}, ${hire}) RETURNING *`;
      return res.status(201).json(rows[0]);
    } 
    
    if (req.method === 'PUT') {
      const { id, fname, lname, dept, pos, hire } = req.body;
      await sql`
        UPDATE workers SET fname=${fname}, lname=${lname}, dept=${dept}, pos=${pos}, hire=${hire} 
        WHERE id=${id}`;
      return res.status(200).json({ success: true });
    } 
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM workers WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }
    
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
