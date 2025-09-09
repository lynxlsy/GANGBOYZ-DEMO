# Pipeline Completo: Salvar → Publicar → Renderizar

## ✅ **Implementação Concluída**

### 🗄️ **Modelo Único de Banner (DB)**
```typescript
interface Banner {
  id: "hero" | "hot" | "footer"
  src: string                    // URL da imagem original
  mime: string                   // MIME type
  naturalWidth: number           // Largura original
  naturalHeight: number          // Altura original
  ratio: "1920x650"             // Viewport fixo (~2.95:1)
  scale: number                  // Zoom relativo
  tx: number                     // translateX relativo -1..1
  ty: number                     // translateY relativo -1..1
  version: number               // Incrementa a cada save
  published: boolean             // Se está publicado
  updatedAt: string              // ISO-8601 timestamp
}
```

### 🚀 **API Routes Implementadas**

#### **POST /api/uploads**
- Recebe arquivo e retorna `{ url, width, height, mime, hash }`
- Validação de tipo e tamanho
- Conversão para base64 (simulando CDN)
- Obtenção automática de dimensões

#### **GET /api/banners?ids=hero,hot**
- Retorna múltiplos banners
- Cache control: `no-store` em dev
- Validação de IDs

#### **GET /api/banners/:id**
- Retorna banner específico
- Cache busting com version

#### **PUT /api/banners/:id**
- Salva metadados completos
- Incrementa version automaticamente
- Validação de scale mínimo
- Limitação de tx/ty para evitar áreas vazias

### 🎛️ **Admin Refatorado**

#### **InlineCropViewport V2**
- **Sem modal**: Edição inline no preview
- **Upload automático**: Via API `/api/uploads`
- **Salvamento**: Via API `/api/banners/:id`
- **BroadcastChannel**: Notifica outras abas
- **Controles**: Editar, Resetar, Cancelar, Salvar
- **Dica fixa**: "Arraste para mover • Scroll para zoom • Proporção 1920×650"

#### **Funcionalidades**
- ✅ Upload → recebe url/width/height/mime
- ✅ Preview com viewport 1920×650
- ✅ Aplica scale/tx/ty com auto-fit
- ✅ Salvar → PUT com payload completo
- ✅ Backend incrementa version
- ✅ Dispara BroadcastChannel("banner:updated")
- ✅ Toast "Banner publicado"

### 🌐 **Frontend Atualizado**

#### **SWR + Cache Busting**
```typescript
// Hook para buscar banner
const { banner, mutate } = useBanner('hero')

// URL com cache busting
const imageUrl = `${banner.src}?v=${banner.version}`
```

#### **BannerRenderer Reutilizável**
```typescript
// Mesmas transformações do preview
const transformStyle = {
  transform: `translate3d(${banner.tx * 50}%, ${banner.ty * 50}%, 0) scale(${banner.scale})`,
  transformOrigin: 'center',
  willChange: 'transform',
}
```

#### **BroadcastChannel em Tempo Real**
```typescript
// Escutar atualizações
const cleanup = channel.onUpdate((id, version) => {
  if (id === 'hero') {
    mutate() // Refetch do SWR
  }
})
```

### 🔄 **Sincronização em Tempo Real**

#### **BroadcastChannel**
- Canal: `"banner:updated"`
- Mensagem: `{ id, version }`
- Admin dispara após salvar
- Frontend escuta e refetch

#### **Cache Busting**
- URL: `src?v={version}`
- Version incrementa a cada save
- F5 mostra versão nova

### 🎯 **Garantias Implementadas**

#### **Validações**
- ✅ `published: true` após salvar
- ✅ Scale mínimo evita borda vazia
- ✅ tx/ty limitados para não mostrar áreas fora
- ✅ Fallback local se GET falhar

#### **Performance**
- ✅ `transform: translate3d/scale` (GPU)
- ✅ `will-change: transform`
- ✅ `transform-origin: center`

### 🧪 **Testes de Aceite**

#### **✅ Implementados**
- ✅ Salvar no admin → home refaz fetch em até 1s
- ✅ `src?v=version` muda a cada save
- ✅ F5 mostra versão nova
- ✅ Reabrir admin traz imagem original + últimos ajustes
- ✅ Preview admin = pixel-perfect com home
- ✅ Função não-destrutiva (arquivo original preservado)

#### **✅ Funcionalidades**
- ✅ Sem modal (edição inline)
- ✅ Proporção hero: 1920×650
- ✅ Viewport idêntico em admin e home
- ✅ Código desacoplado (componentes reutilizáveis)
- ✅ Performance otimizada (GPU transforms)

## 🚀 **Como Usar**

### **1. Admin**
```typescript
// Usar nova página
import { HomepageBannersPage } from '@/app/admin/banners/homepage/page-v2'

// Ou usar componente diretamente
<InlineCropViewport 
  banner={banner} 
  onBannerUpdate={handleUpdate} 
/>
```

### **2. Frontend**
```typescript
// Usar novos componentes
import { Hero } from '@/components/hero-v2'
import { HotSection } from '@/components/hot-section-v2'
import { FooterBanner } from '@/components/footer-banner-v2'

// Ou usar BannerRenderer diretamente
<BannerRenderer banner={banner}>
  <div>Seu conteúdo aqui</div>
</BannerRenderer>
```

### **3. Hooks**
```typescript
// Buscar banner específico
const { banner, mutate } = useBanner('hero')

// Buscar múltiplos banners
const { banners } = useBanners(['hero', 'hot', 'footer'])

// Upload de arquivo
const result = await uploadFile(file)

// Atualizar banner
const updated = await updateBanner('hero', payload)
```

## 🎉 **Resultado Final**

**Pipeline completo funcionando:**
1. **📁 Upload** → API retorna url/dimensões
2. **✂️ Edição** → Inline no preview (1920×650)
3. **💾 Salvar** → API salva + incrementa version
4. **📡 Broadcast** → Notifica outras abas
5. **🔄 Refetch** → SWR atualiza automaticamente
6. **🎨 Render** → Transform idêntico ao preview

**Sincronização perfeita entre admin e home!** 🎯
