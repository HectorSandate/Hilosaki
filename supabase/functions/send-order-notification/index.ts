import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order, items, deliveryType } = await req.json()

    // Here you would integrate with your email service
    // For example, using SendGrid, Resend, or similar
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ec4899; text-align: center;">Nuevo Pedido - Hilosaki</h1>
        
        <div style="background: #fdf2f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2>Información del Pedido</h2>
          <p><strong>Número de Pedido:</strong> ${order.order_number}</p>
          <p><strong>Cliente:</strong> ${order.customer_name}</p>
          <p><strong>Teléfono:</strong> ${order.customer_phone}</p>
          <p><strong>Método de Entrega:</strong> ${deliveryType === 'delivery' ? 'Entrega a domicilio' : 'Recoger en persona'}</p>
          ${order.customer_address ? `<p><strong>Dirección:</strong> ${order.customer_address}</p>` : ''}
          <p><strong>Total:</strong> $${order.total_amount}</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2>Productos</h2>
          ${items.map(item => `
            <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
              <p><strong>${item.product?.name}</strong></p>
              <p>Cantidad: ${item.quantity}</p>
              <p>Precio: $${item.product?.price}</p>
              <p>Subtotal: $${(item.product?.price * item.quantity).toFixed(2)}</p>
            </div>
          `).join('')}
        </div>
        
        ${order.notes ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>Notas Adicionales</h2>
            <p>${order.notes}</p>
          </div>
        ` : ''}
      </div>
    `

    // Replace with your actual email sending logic
    console.log('Would send email with content:', emailHtml)
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})