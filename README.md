# Miau Miau — Web

## Despliegue (Easypanel)

- **Dockerfile:** en la raíz (`Dockerfile`) y copia en `dockerizer/Dockerfile` (scripts `npm run docker:*`). Si cambias la imagen, mantén ambos alineados.
- **Puerto del contenedor:** 80 (nginx). En Easypanel, proxy / dominio apuntando al puerto interno 80.
- **Autodespliegue (recomendado):** en el servicio de Easypanel, activa **Auto Deploy** y conecta el repositorio de GitHub; Easypanel registrará el webhook y desplegará en cada push.
- **Autodespliegue vía GitHub Actions:** copia la URL del **Deploy Webhook** del servicio y créala como secret `EASYPANEL_DEPLOY_WEBHOOK_URL` en el repo (Settings → Secrets and variables → Actions). El workflow `.github/workflows/easypanel-deploy.yml` hará `POST` en cada push a `main` o `master`.

### Docker local (igual que catmate-control-center)

```bash
npm run docker:build
npm run docker:deploy   # build limpio + contenedor en :80
```
