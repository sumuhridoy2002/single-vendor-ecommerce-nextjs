export default function RefundPolicyPage() {
  return (
    <div className="container max-w-3xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Return and Refund Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          Arogga is committed to customer satisfaction. We offer a flexible return, replacement,
          and refund policy subject to the conditions below.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-6">Return/Replacement Policy</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Items must be unused and unopened with original packaging and seal intact.</li>
          <li>Certain products are non-returnable (e.g., perishables or hygiene products).</li>
          <li>Heat-sensitive goods may have additional restrictions.</li>
          <li>For damaged or defective items, report within 7 days of delivery.</li>
          <li>Replacement within 24–48 hours inside Dhaka, 5–7 days outside Dhaka.</li>
          <li>Proof of purchase may be required.</li>
        </ol>

        <h2 className="text-lg font-semibold text-foreground mt-6">Refund Policy</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Refunds are available for damaged/defective products or order errors.</li>
          <li>Refund processing typically takes 1–7 working days.</li>
          <li>For missing items, we may offer an instant refund or replacement.</li>
          <li>Refunds are credited to your Arogga wallet; for COD orders, bKash withdrawal option may be available.</li>
        </ol>

        <h2 className="text-lg font-semibold text-foreground mt-6">Claim Policy</h2>
        <p>
          An unboxing video may be required as proof for return, replacement, or refund claims. This
          helps us process your request fairly and quickly.
        </p>
      </div>
    </div>
  );
}
