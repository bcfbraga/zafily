-- Fecha o acesso público direto ao banco (alerta "rls_disabled_in_public" do Supabase).
--
-- A chave anônima (NEXT_PUBLIC_SUPABASE_ANON_KEY) fica embutida no JavaScript
-- entregue ao navegador, ou seja, é pública por definição. Sem RLS, qualquer
-- pessoa com essa chave e a URL do projeto podia ler, alterar e apagar todas as
-- linhas de todas as tabelas abaixo pela API REST do Supabase.
--
-- Nenhuma política é criada de propósito: com RLS ligado e sem políticas, os
-- papéis anon e authenticated não enxergam nem alteram nada. O app não perde
-- acesso porque todas as consultas acontecem no servidor com a chave
-- SUPABASE_SECRET_KEY (papel service_role), que ignora RLS por definição.
-- O login também não é afetado: o navegador só usa supabase.auth.*, que opera
-- no schema auth, fora do alcance destas políticas.
--
-- Pré-requisito: fazer o deploy do commit que move a rota de reordenação de
-- produtos para o service_role ANTES de rodar esta migration. Era o único ponto
-- do app que escrevia em tabela usando a chave anônima.

ALTER TABLE access_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets                ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons                ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE links                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_impressions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_slug_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_views             ENABLE ROW LEVEL SECURITY;
ALTER TABLE lives                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_clicks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE username_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitrine_sections       ENABLE ROW LEVEL SECURITY;

-- Conferência: esta consulta deve voltar zero linhas depois de rodar o script.
-- Se aparecer alguma tabela, ela foi criada fora das migrations e também
-- precisa de RLS.
--
-- SELECT tablename FROM pg_tables
-- WHERE schemaname = 'public' AND rowsecurity = false;
