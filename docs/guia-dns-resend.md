# Configuración DNS para correos transaccionales (Resend)

> Guía paso a paso para configurar SPF, DKIM y DMARC en el dominio `scalesystems.com.ve`
> para que los correos de Resend no caigan en spam y pasen autenticación estricta.

---

## 1. SPF (Sender Policy Framework)

Autoriza a Resend como emisor legítimo de correos en tu dominio.

**Registro TXT en `scalesystems.com.ve`:**

```
v=spf1 include:_spf.resend.com ~all
```

- `include:_spf.resend.com` → delega a Resend la lista de IPs autorizadas.
- `~all` → softfail (marca como sospechoso pero no rechaza). Cambiar a `-all` (rechazar) solo cuando estés seguro de que no hay otros emisores legítimos.

---

## 2. DKIM (DomainKeys Identified Mail)

Resend firma digitalmente cada correo. Necesitas publicar su clave pública en tu DNS para que los servidores receptores la verifiquen.

Al configurar tu dominio en **Resend Dashboard → Domains**, Resend te proporciona **3 registros CNAME**. Agrégalos tal cual:

| Tipo  | Host                              | Valor                              |
|-------|-----------------------------------|-------------------------------------|
| CNAME | `resend._domainkey.scalesystems.com.ve` | `resend.dkim.resend.com`     |
| CNAME | `resend1._domainkey.scalesystems.com.ve` | `resend1.dkim.resend.com`   |
| CNAME | `resend2._domainkey.scalesystems.com.ve` | `resend2.dkim.resend.com`   |

> ⚠️ **Importante:** Los valores exactos te los da Resend al agregar el dominio.
> Si pierdes los valores, puedes regenerarlos desde el dashboard.

---

## 3. DMARC (Domain-based Message Authentication, Reporting & Conformance)

Política que le dice a los servidores receptores qué hacer si un correo no pasa SPF y/o DKIM.

**Registro TXT en `_dmarc.scalesystems.com.ve`:**

```
v=DMARC1; p=quarantine; rua=mailto:postmaster@scalesystems.com.ve; adkim=s; aspf=s
```

| Parámetro | Valor        | Significado |
|-----------|--------------|-------------|
| `p`       | `quarantine` | Marca como spam los correos que fallan autenticación (recomendado inicialmente). |
| `rua`     | `mailto:...` | Dirección donde recibirás informes XML de los servidores receptores. |
| `adkim`   | `s`          | Modo estricto para DKIM (el dominio en la firma debe coincidir exactamente). |
| `aspf`    | `s`          | Modo estricto para SPF. |

> Para producción después de verificar que todo pasa: cambiar `p=quarantine` a `p=reject`.

---

## 4. Verificación

Una vez publicados los registros DNS (puede tomar de 1 minuto a 24 horas propagarse):

1. En **Resend Dashboard → Domains**, el estado debe pasar a **"Verified"** (verde).
2. Enviar un correo de prueba y revisar las cabeceras:
   ```
   SPF: PASS
   DKIM: PASS
   DMARC: PASS
   ```
3. Usar [Mail-Tester](https://www.mail-tester.com/) para validar la reputación del dominio.

---

## 5. Referencia

- [Resend Docs: Domains](https://resend.com/docs/dashboard/domains/introduction-to-domains)
- [Resend Docs: DKIM](https://resend.com/docs/dashboard/domains/dkim)
- [DMARC.org](https://dmarc.org/)
