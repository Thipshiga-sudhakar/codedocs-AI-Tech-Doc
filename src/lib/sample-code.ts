export const sampleCodes = [
  {
    title: "Express.js API",
    language: "JavaScript",
    description: "RESTful API with authentication & CRUD",
    code: `const express = require('express');
const router = express.Router();

/**
 * Get all users with optional filtering
 * @route GET /api/users
 */
router.get('/users', authenticate, async (req, res) => {
  const { role, limit = 20, offset = 0 } = req.query;
  const users = await User.findAll({ where: role ? { role } : {}, limit, offset });
  res.json({ users, total: users.length });
});

router.post('/users', authenticate, authorize('admin'), async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  const user = await User.create({ name, email, role: role || 'basic' });
  res.status(201).json(user);
});

router.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
});`,
  },
  {
    title: "Python ML Script",
    language: "Python",
    description: "Data pipeline with scikit-learn model",
    code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

class DataPipeline:
    """End-to-end ML pipeline for classification tasks."""
    
    def __init__(self, data_path: str, target_col: str):
        self.data_path = data_path
        self.target_col = target_col
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    def load_and_preprocess(self) -> pd.DataFrame:
        """Load CSV data and handle missing values."""
        df = pd.read_csv(self.data_path)
        df = df.dropna(subset=[self.target_col])
        df = df.fillna(df.median(numeric_only=True))
        return df
    
    def train(self, df: pd.DataFrame) -> dict:
        """Split data and train the model. Returns metrics."""
        X = df.drop(columns=[self.target_col])
        y = df[self.target_col]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        self.model.fit(X_train, y_train)
        preds = self.model.predict(X_test)
        return {"accuracy": accuracy_score(y_test, preds),
                "report": classification_report(y_test, preds)}
    
    def predict(self, features: list) -> str:
        """Make prediction on new data."""
        return self.model.predict([features])[0]`,
  },
  {
    title: "React Component",
    language: "TypeScript",
    description: "Reusable data table with sorting & filtering",
    code: `import React, { useState, useMemo, useCallback } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, pageSize = 10, onRowClick, searchable = true
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const toggleSort = useCallback((key: keyof T) => {
    setSortKey(prev => { setSortDir(prev === key ? (d => d === 'asc' ? 'desc' : 'asc') as any : 'asc'); return key; });
  }, []);

  return (
    <div className="data-table">
      {searchable && <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />}
      <table>
        <thead><tr>{columns.map(col => (
          <th key={String(col.key)} onClick={() => col.sortable && toggleSort(col.key)}>
            {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </th>
        ))}</tr></thead>
        <tbody>{paged.map((row, i) => (
          <tr key={i} onClick={() => onRowClick?.(row)}>
            {columns.map(col => <td key={String(col.key)}>{col.render ? col.render(row[col.key], row) : String(row[col.key])}</td>)}
          </tr>
        ))}</tbody>
      </table>
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}`,
  },
];
