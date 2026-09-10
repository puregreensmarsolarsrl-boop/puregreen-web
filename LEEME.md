# Puregreen Smart Solar · Web con panel

La web conserva el diseño, la calculadora y los contactos por WhatsApp. No contiene cobros ni pagos online. El panel permite editar textos, cambiar teléfonos, añadir y ordenar instalaciones y productos, y subir fotografías.

**Estado de entrega:** preparada y probada localmente. No se ha modificado ni publicado nada en tus cuentas. Falta la conexión inicial de GitHub y Netlify para activar el panel. Arrastrar un ZIP a Netlify Drop publica archivos, pero NO conecta el panel ni activa futuras publicaciones automáticas.

## Qué necesitas una sola vez

Una cuenta de GitHub que controles, un repositorio para esta web y acceso de administrador a tu proyecto de Netlify. El sistema usa Decap CMS: entras con GitHub; solo las cuentas con permiso de escritura en ese repositorio pueden guardar cambios. La dirección del formulario de entrada es pública; la escritura está protegida por GitHub.

### 1. Guardar el proyecto en GitHub

1. Descomprime `Puregreen-proyecto-panel.zip`.
2. En GitHub crea un repositorio llamado, por ejemplo, `puregreen-web`. Puede ser privado. Usa la rama `main`.
3. Sube el contenido de la carpeta descomprimida a la raíz del repositorio, conservando las carpetas `admin`, `content`, `src` y `uploads`. Deben verse `build.mjs`, `package.json` y `netlify.toml` en la raíz. No subas el ZIP como un solo archivo.
4. Abre `admin/config.yml` y cambia únicamente `CAMBIAR_USUARIO/CAMBIAR_REPOSITORIO` por el dueño y nombre reales, por ejemplo `miusuario/puregreen-web`. Guarda el cambio. El archivo utiliza JSON, que también es YAML válido; conserva comillas y comas.
5. Si cambias el dominio, actualiza también `site_url` y `display_url` en ese archivo. Actualmente apuntan a `https://charming-peony-04a777.netlify.app`.

### 2. Conectar Netlify para publicar automáticamente

1. Abre en Netlify el proyecto existente `charming-peony-04a777`.
2. En **Project configuration → Build & deploy → Continuous deployment → Repository**, conecta el repositorio de GitHub. Si la interfaz ofrece **Link repository** o **Link to a different repository**, utiliza esa opción. Autoriza la aplicación de Netlify para ese repositorio.
3. Rama: `main`. Directorio base: vacío. Comando de construcción: `node build.mjs`. Carpeta de publicación: `dist`. Estos valores también vienen en `netlify.toml`.
4. Inicia el primer despliegue y espera a que aparezca como publicado. Vincula el proyecto existente para conservar su dirección; crear otro proyecto genera otra dirección.

### 3. Activar el acceso privado al panel

Conectar el repositorio para publicar y configurar la entrada al panel son dos conexiones diferentes.

1. En GitHub entra a **Settings → Developer settings → OAuth Apps → New OAuth App**: https://github.com/settings/developers
2. Nombre: `Puregreen Panel`. Homepage URL: `https://charming-peony-04a777.netlify.app`. Authorization callback URL: **`https://api.netlify.com/auth/done`**.
3. Copia el **Client ID** y genera un **Client Secret**.
4. En el proyecto de Netlify ve a **Project configuration → Access & security → OAuth → Authentication Providers → Install Provider**. Elige GitHub e introduce allí el Client ID y el Client Secret.
5. El secreto se guarda exclusivamente en esa configuración de Netlify. No lo pongas en archivos de la web, GitHub, el panel ni mensajes.
6. Abre `https://charming-peony-04a777.netlify.app/admin/`, entra con tu cuenta de GitHub y autoriza el acceso. La cuenta debe tener permiso de escritura en el repositorio. Si pertenece a una organización, puede necesitar autorización de la organización.

## Cómo editar después

1. Entra a tu dirección terminada en `/admin/` desde ordenador o teléfono y accede con GitHub.
2. Abre **Mi página web** y la sección que quieras cambiar.
3. En **Fotos de instalaciones** o **Catálogo**, añade una tarjeta o abre una existente. Escribe título y descripción; usa el campo Fotografía para cargar un JPG, PNG o WebP. Completa la descripción de la foto para lectores de pantalla. También puedes quitar o reordenar tarjetas.
4. Para teléfonos, usa **Contacto**, incluyendo el código del país y solo dígitos. Todos los enlaces y los mensajes de la calculadora usarán esos números.
5. Pulsa **Publicar** en el panel (puede aparecer como Publish). Netlify recibirá el cambio y generará una nueva versión. Espera a que termine el despliegue y recarga la web. La actualización no es instantánea.
6. Cierra sesión al terminar, especialmente en un equipo compartido. Ya no necesitas volver a subir carpetas ni usar IA para estas ediciones.

El formulario de textos mantiene las secciones actuales; añadir nuevas secciones de diseño requiere modificar la plantilla. Puedes añadir libremente tarjetas de instalaciones y productos. La vista previa del editor está desactivada: comprueba el resultado en la web después de publicar. No se incluyen fotos inventadas de instalaciones; las tarjetas iniciales mantienen fondos de color hasta que subas tus fotos.

## Fotos, historial y recuperación

Usa preferiblemente fotos horizontales de unos 1600 píxeles y menos de 2 MB. Se recortan visualmente para encajar en las tarjetas. Evita vídeos y archivos enormes. Cada publicación se guarda en GitHub y queda en su historial. Quitar una tarjeta no borra automáticamente su foto; no borres una imagen que todavía use otra tarjeta.

Si hay un error al generar una nueva versión, Netlify mantiene la última publicación correcta. Revisa el despliegue fallido: una imagen con formato no admitido o ausente puede detenerlo. Corrige el campo desde el panel y vuelve a publicar. Para deshacer un cambio, restaura el archivo correspondiente usando el historial de GitHub y deja que Netlify vuelva a publicar. Un rollback en Netlify cambia temporalmente lo que se ve; no corrige por sí solo el contenido del repositorio.

El alojamiento, las publicaciones y el almacenamiento están sujetos a los límites y condiciones de tus cuentas. No se ha contratado ningún plan. El panel carga Decap CMS 3.9.0 desde UNPKG y necesita conexión a ese servicio y a GitHub. La web pública y la calculadora no necesitan cargar el CMS.

## Comprobación al activar tus cuentas

Entra al panel, modifica una descripción y publica. Confirma el cambio en GitHub y que Netlify finalice el despliegue; abre la web en una ventana privada. Sube una foto y comprueba que siga visible tras cerrar sesión y desde otro dispositivo. Comprueba ambos WhatsApp. Esta prueba completa requiere tus cuentas y todavía no se ha realizado.

## Para quien haga el mantenimiento

`content/*.json`: datos editados por Decap. `uploads/`: fotografías. `src/template.html`: diseño original con campos. `admin/config.yml`: configuración del CMS sin secretos. `node build.mjs`: genera `dist/`. `node test.mjs`: prueba generación, esquema del panel, renderizado de fotos y escape de HTML. No requiere instalar paquetes para construir la web. Conserva los cambios en el repositorio: editar `dist/index.html` no actualiza el contenido fuente.

Validación realizada: generación estática, correspondencia entre campos y contenido, inclusión de fotos, escape de texto, rechazo de rutas inválidas, vista de escritorio y móvil sin desbordamiento horizontal, calculadora de 950 kWh → 12 paneles de 640 W con valores iniciales, enlace de resultados por WhatsApp y aviso del panel sin configurar. El acceso GitHub, la carga remota del CMS y el despliegue real están pendientes de activación y comprobación con las cuentas del propietario.

## Documentación oficial consultada

- Acceso GitHub de Decap: https://decapcms.org/docs/github-backend/
- Credenciales OAuth en Netlify: https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/
- Vincular repositorio existente: https://docs.netlify.com/build/git-workflows/repo-permissions-linking/
- Publicaciones automáticas: https://docs.netlify.com/deploy/create-deploys/

Preparado el 9 de septiembre de 2026.

