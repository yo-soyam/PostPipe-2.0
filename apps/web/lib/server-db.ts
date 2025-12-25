import fs from 'fs';
import path from 'path';

// --- Types ---
export interface Connector {
  id: string;      // Generated UUID
  secret: string;  // Generated "sk_..."
  url: string;     // e.g. http://localhost:3001
  name: string;
}

export interface FormField {
  name: string;
  type: string;    // text, email, number, etc.
  required: boolean;
}

export interface Form {
  id: string; // Slug/ID e.g. "contact-us"
  name: string;
  connectorId: string;
  fields: FormField[];
  createdAt: string;
}

interface DB {
  connectors: Connector[];
  forms: Form[];
}

// --- Persistence ---
const DB_PATH = path.join(process.cwd(), 'mock-db.json');

function readDB(): DB {
  if (!fs.existsSync(DB_PATH)) {
    return { connectors: [], forms: [] };
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { connectors: [], forms: [] };
  }
}

function writeDB(db: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// --- Connectors ---
export function registerConnector(url: string, name: string = 'My Connector'): Connector {
  const db = readDB();
  
  // Clean URL
  let cleanUrl = url.replace(/\/$/, ""); 
  
  // Check duplicates
  const existing = db.connectors.find(c => c.url === cleanUrl);
  if (existing) return existing;

  const newConnector: Connector = {
    id: `conn_${Math.random().toString(36).substr(2, 9)}`,
    secret: `sk_live_${Math.random().toString(36).substr(2, 16)}${Math.random().toString(36).substr(2, 16)}`,
    url: cleanUrl,
    name
  };

  db.connectors.push(newConnector);
  writeDB(db);
  return newConnector;
}

export function getConnector(id: string): Connector | undefined {
  const db = readDB();
  return db.connectors.find(c => c.id === id);
}

export function getConnectors(): Connector[] {
    return readDB().connectors;
}


// --- Forms ---
export function createForm(connectorId: string, name: string, fields: FormField[]): Form {
  const db = readDB();
  
  // Simple slugify for ID
  const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let id = baseId;
  let counter = 1;
  while (db.forms.find(f => f.id === id)) {
      id = `${baseId}-${counter++}`;
  }

  const newForm: Form = {
    id,
    name,
    connectorId,
    fields,
    createdAt: new Date().toISOString()
  };

  db.forms.push(newForm);
  writeDB(db);
  return newForm;
}

export function getForms(): Form[] {
  return readDB().forms;
}

export function getForm(id: string): Form | undefined {
  return readDB().forms.find(f => f.id === id);
}

export function deleteConnector(id: string) {
  const db = readDB();
  db.connectors = db.connectors.filter(c => c.id !== id);
  // Optional: Cascade delete forms? Let's keep it simple for now or yes? 
  // Better to cascade delete forms associated with the connector to avoid orphans.
  db.forms = db.forms.filter(f => f.connectorId !== id);
  writeDB(db);
}

export function deleteForm(id: string) {
  const db = readDB();
  db.forms = db.forms.filter(f => f.id !== id);
  writeDB(db);
}
