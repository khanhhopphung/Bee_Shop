<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewProductEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        // public object $product
        public int $id,
        public string $name,
        public string $sku,
        public string $description,
        public int $category_id,
        public int $stock,
        public ?float $price_max,
        public ?float $price_min,
        public ?string $image_url,
        public ?string $alt_text,
        public array $color,
        public array $size,
        public array $product_variants
    )
    {
    }

    public function broadcastOn()
    {
        return ['product'];
    }

    public function broadcastAs()
    {
        return 'variant';
    }

    
}