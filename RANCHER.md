# 🤠 Execução Local no Rancher Desktop

O **OrchestrAI Studio** é totalmente compatível com o **Rancher Desktop**, oferecendo duas opções de execução local:

---

## 🚀 Opção 1: Via Container Engine / Compose (Mais Rápido e Simples)

O Rancher Desktop inclui suporte nativo a `nerdctl` (containerd) e `docker` (moby).

### Comando Único:
```bash
nerdctl compose up -d --build
```
*(ou se você configurou o runtime Moby/Docker no Rancher Desktop:)*
```bash
docker compose up -d --build
```

### Script Automatizado Incluso:
```bash
./rancher-run.sh compose
```

### URLs de Acesso:
- **Aplicação & API**: [http://localhost:3000](http://localhost:3000)
- **Banco de Dados PostgreSQL**: `localhost:5432`
  - **Database**: `orchestrai_db`
  - **Usuário**: `orchestrai`
  - **Senha**: `orchestrai_secret_password`

### Comandos Úteis:
- Ver logs em tempo real:
  ```bash
  nerdctl compose logs -f
  # ou
  docker compose logs -f
  ```
- Parar a aplicação:
  ```bash
  nerdctl compose down
  # ou
  docker compose down
  ```

---

## ☸️ Opção 2: Via Kubernetes Local (k3s do Rancher Desktop)

Se você utiliza o Rancher Desktop com o cluster local Kubernetes (`k3s`) ativado:

### 1. Build da Imagem Local no Namespace do Rancher:
```bash
nerdctl --namespace k8s.io build -t orchestrai-studio:latest .
# ou se estiver usando dockerd:
docker build -t orchestrai-studio:latest .
```

### 2. Aplicar os Manifestos K8s:
```bash
kubectl apply -k k8s/
```

### Script Automatizado Incluso:
```bash
./rancher-run.sh k8s
```

### URLs de Acesso no Modo Kubernetes:
- **NodePort**: [http://localhost:30300](http://localhost:30300)
- **Verificar Pods**:
  ```bash
  kubectl get pods -n orchestrai
  ```
- **Verificar Logs do App**:
  ```bash
  kubectl logs -n orchestrai -l app=orchestrai-studio -f
  ```
- **Destruir Ambiente no K8s**:
  ```bash
  kubectl delete -k k8s/
  ```
