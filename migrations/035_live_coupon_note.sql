-- Linha de apoio da barra de cupom ("até as 22h em todo o site").
--
-- O código do cupom já existe em coupon_code, mas sozinho ele não diz prazo
-- nem abrangência, que é o que faz a pessoa agir na hora. Texto livre porque
-- cada live tem uma condição diferente.
ALTER TABLE lives ADD COLUMN IF NOT EXISTS coupon_note TEXT;
