import { all, one } from "./db";
import type { Property, Deal, Article } from "./queries";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  kind: string;
  property_id: number | null;
  property_title: string;
  source: string;
  status: string;
  notified: number;
  created_at: string;
};

import { LEAD_STATUSES, STATUS_LABEL } from "./lead-status";

export { LEAD_STATUSES, STATUS_LABEL };

export function listLeads(status = ""): Lead[] {
  if (status) {
    return all<Lead>(
      "SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC, id DESC",
      status,
    );
  }
  return all<Lead>("SELECT * FROM leads ORDER BY created_at DESC, id DESC");
}

export function leadStatusCounts(): { value: string; count: number }[] {
  return all<{ value: string; count: number }>(
    "SELECT status AS value, COUNT(*) AS count FROM leads GROUP BY status",
  );
}

export function adminProperties(): Property[] {
  return all<Property>("SELECT * FROM properties ORDER BY id DESC");
}

export function adminPropertyById(id: number): Property | null {
  return one<Property>("SELECT * FROM properties WHERE id = ?", id);
}

export function adminDeals(): Deal[] {
  return all<Deal>("SELECT * FROM deals ORDER BY closed_on DESC, id DESC");
}

export function adminDealById(id: number): Deal | null {
  return one<Deal>("SELECT * FROM deals WHERE id = ?", id);
}

export function adminArticles(): Article[] {
  return all<Article>(
    "SELECT * FROM articles ORDER BY published_on DESC, id DESC",
  );
}

export function adminArticleById(id: number): Article | null {
  return one<Article>("SELECT * FROM articles WHERE id = ?", id);
}

export function dashboardStats(): {
  properties: number;
  published: number;
  deals: number;
  articles: number;
  leads: number;
  leadsNew: number;
  leads7d: number;
  images: number;
} {
  const n = (sql: string) => one<{ c: number }>(sql)?.c ?? 0;
  return {
    properties: n("SELECT COUNT(*) AS c FROM properties"),
    published: n("SELECT COUNT(*) AS c FROM properties WHERE published = 1"),
    deals: n("SELECT COUNT(*) AS c FROM deals"),
    articles: n("SELECT COUNT(*) AS c FROM articles"),
    leads: n("SELECT COUNT(*) AS c FROM leads"),
    leadsNew: n("SELECT COUNT(*) AS c FROM leads WHERE status = 'new'"),
    leads7d: n(
      "SELECT COUNT(*) AS c FROM leads WHERE created_at > datetime('now','-7 days')",
    ),
    images: n("SELECT COUNT(*) AS c FROM property_images"),
  };
}
