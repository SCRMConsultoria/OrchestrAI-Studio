#!/usr/bin/env bash
# ==============================================================================
# OrchestrAI Studio - Script de Execução Local no Rancher Desktop
# Suporta:
#  1. Modo Container Engine (nerdctl / docker compose)
#  2. Modo Kubernetes (k3s / kubectl kustomize)
# ==============================================================================

set -euo pipefail

MODE="${1:-compose}"

echo "=========================================================="
echo "🚀 OrchestrAI Studio - Inicialização no Rancher Desktop"
echo "=========================================================="

# Identificar ferramenta de containerd no Rancher Desktop
if command -v nerdctl &> /dev/null; then
  CONTAINER_CLI="nerdctl"
elif command -v docker &> /dev/null; then
  CONTAINER_CLI="docker"
else
  echo "⚠️ Nenhum executável (nerdctl ou docker) encontrado. Certifique-se de que o Rancher Desktop está aberto."
  exit 1
fi

echo "🔧 Container Engine detectado: $CONTAINER_CLI"

if [ "$MODE" == "compose" ]; then
  echo "📦 Subindo containers via $CONTAINER_CLI compose..."
  $CONTAINER_CLI compose up -d --build
  echo ""
  echo "✅ Aplicação iniciada com sucesso no Rancher Desktop!"
  echo "🌐 Frontend & API: http://localhost:3000"
  echo "🐘 PostgreSQL: localhost:5432 (database: orchestrai_db, user: orchestrai)"
  echo ""
  echo "Para verificar os logs:"
  echo "   $CONTAINER_CLI compose logs -f"
  echo ""
  echo "Para parar os serviços:"
  echo "   $CONTAINER_CLI compose down"

elif [ "$MODE" == "k8s" ] || [ "$MODE" == "kubernetes" ]; then
  echo "☸️ Modo Kubernetes (k3s) selecionado..."
  
  # Build da imagem local no namespace k8s.io do Rancher
  echo "🔨 Construindo imagem orchestrai-studio:latest..."
  $CONTAINER_CLI build -t orchestrai-studio:latest .

  echo "🚀 Aplicando manifestos no cluster k3s do Rancher Desktop..."
  kubectl apply -k k8s/

  echo ""
  echo "⏳ Aguardando pods estarem prontos..."
  kubectl wait --namespace orchestrai --for=condition=ready pod --selector=app=postgres --timeout=90s || true
  kubectl wait --namespace orchestrai --for=condition=ready pod --selector=app=orchestrai-studio --timeout=90s || true

  echo ""
  echo "✅ Deploy Kubernetes concluído com sucesso!"
  echo "🌐 Acesso via NodePort: http://localhost:30300"
  echo "🔍 Para verificar os pods:"
  echo "   kubectl get pods -n orchestrai"
  echo "📜 Para verificar os logs do app:"
  echo "   kubectl logs -n orchestrai -l app=orchestrai-studio -f"
else
  echo "Uso: ./rancher-run.sh [compose | k8s]"
  exit 1
fi
