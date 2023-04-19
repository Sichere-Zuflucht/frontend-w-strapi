<template>
	<div class="py-14">
		<h4
			class="text-uppercase text-h3 secondary--text font-weight-bold mb-6 mt-2 caption"
		>
			Preise
		</h4>
		<p class="font-weight-bold mb-6 caption">
			Eine Beratung dauert 50 Min. und kostet 50 €
		</p>
		<p class="font-weight-bold mb-0 caption">Die Beratung beinhaltet:</p>
		<ul class="caption">
			<li>
				ein 50 minütiges Beratungsgespräch mit einem*r qualifizierten Berater*in
			</li>
			<li>Beratung zur spezifischen Problemstellung der Frau</li>
			<li>Antworten und Ratschläge für die Anliegen der Frau</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			nosheet: {
				type: Boolean,
				default: true,
			},
		},
	};
</script>
