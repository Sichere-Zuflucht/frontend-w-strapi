<template>
  <div>
    <UtilsBanner url="AdobeStock_342417877.jpeg" />
    <v-sheet color="grey lighten-5">
      <v-container class="py-16">
        <div class="text-center">
          <h1 class="text-h1 primary--text">
            Beraten Sie Frauen mit Ihrem Know-How!
          </h1>
          <h2 class="text-h2 secondary--text mb-6">
            Online-Beratung.<br />sicher, schnell, anonym
          </h2>
          <p class="caption">
            Unsere Plattform ermöglicht Frauen in Gewaltbeziehungen sich anonym
            von Ihnen beraten zu lassen. <br />Unterstützen Sie Frauen mit Ihren
            Kompetenzen.
          </p>
          <UtilsBtn
            text="Ja, ich möchte beraten"
            link="registration/signup"
          /></div></v-container></v-sheet
    ><v-container class="py-16"
      ><div>
        <h2 class="text-h2 secondary--text mb-8">
          Warum brauchen gewaltbetroffene Frauen Ihre Unterstützung?
        </h2>
      </div>

      <v-row
        ><v-col cols="12" sm="6"
          ><h3
            class="text-h4 primary--text text-uppercase py-4 font-weight-bold"
          >
            Jede 3. Frau
          </h3>
          <v-img src="/jede-dritte-frau.jpg" />
          <p class="caption pt-2 mb-8">
            <b>Jede 3. Frau</b> ist einmal in ihrem Leben von häuslicher Gewalt
            betroffen! Das heißt jede*r von uns <b>kennt mindestens EINE.</b>
          </p>
        </v-col>
        <v-col cols="12" sm="6">
          <h3
            class="text-h4 primary--text text-uppercase py-4 font-weight-bold"
          >
            42 Millionen Frauen
          </h3>
          <v-img src="/diagramm.jpg" />
          <p class="caption pt-2 mb-8">
            <b>Frauenhäuser und Beratungsstellen</b> melden seit Jahren, dass
            sie der <b>Nachfrage nicht gerecht</b> werden können.
            <a
              href="https://www.bmfsfj.de/bmfsfj/service/publikationen/gewalt-gegen-frauen-in-paarbeziehungen-80614"
              target="_blank"
              >"Gewalt gegen Frauen in Paarbeziehungen”</a
            >
            vom BMFSFJ. Frauenhäuser und Beratungsangebote melden seit Jahren,
            dass sie der Nachfrage nicht gerecht werden können.
          </p>
        </v-col></v-row
      >
      <div style="max-width: 600px" class="mx-auto">
        <ul class="secondary--text">
          <li>
            <p class="black--text">
              Häusliche Gewalt ist immer noch ein weit verbreitetes
              gesellschaftliches Problem mit
              <b>großem Stigma und hoher Dunkelziffer.</b>
            </p>
          </li>
          <li>
            <p class="black--text">
              <span v-html="readmoreText.slice(0, length)"></span>
            </p>
            <v-btn
              v-if="length != readmoreText.length"
              plain
              color="primary"
              class="pl-0"
              @click="length = readmoreText.length"
              ><u>weiterlesen</u></v-btn
            >
          </li>
        </ul>
      </div>
    </v-container>
    <v-divider />
    <SharedTargetGroup />
    <v-container>
      <ul class="secondary--text mb-8 mx-auto" style="max-width: 600px">
        <li>
          <p class="black--text">
            Frauen mit einem höheren Bildungshintergrund, Erfolg im Beruf und
            eigenem Einkommen – die also
            <b>fest im Leben stehen und sozial integriert</b> sind –
            <b>schrecken häufig vor bekannten Hilfsangeboten zurück.</b>
          </p>
        </li>
        <li>
          <p class="black--text">
            Aufgrund ihres <b>Schamgefühls</b> fällt es Ihnen besonders schwer
            Unterstützung in Frauenhäusern zu suchen oder sich an lokale
            Hilfsangebote zu wenden.
          </p>
        </li>
        <li>
          <p class="black--text">
            <b>Sichere Zuflucht</b> hat es sich zur Aufgabe gemacht gerade
            diesen Frauen eine für Sie <b>passende Unterstützung</b> anzubieten.
          </p>
        </li>
      </ul>
    </v-container>
    <v-divider />
    <v-container>
      <h2 class="text-h2 text-center secondary--text pt-8">Themenbereiche</h2>
      <h3
        class="text-h3 text-center primary--text text-uppercase pt-2 pb-8 font-weight-bold"
      >
        wo können Sie mit Ihren Kompetenzen beraten?
      </h3>
      <div style="max-width: 600px" class="mx-auto">
        <p class="font-weight-bold mb-2">Coaching</p>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem i
        </p>
        <p class="font-weight-bold mb-2 mt-8">Psychologische Beratung</p>
        <p>
          Haben Sie Erfahrungen in der Beratung von gewaltbetroffen Frauen oder
          Frauenspezifischen Themen? Kennen Sie die Grundmuster von
          Partnerschaftsgewalt und Gewaltdynamiken? Sind sie aufgrund ihres
          beruflichen Hintergrundes in der Lage misshandelte Frauen zu
          unterstützen sich aus ihrer Situation zu befreien?
        </p>
        <p class="font-weight-bold mb-2 mt-8">Rechtsberatung</p>
        <p>Sind sie Anwalt/Anwältin im Bereich Familienrecht?</p>
      </div>
    </v-container>
    <v-sheet color="grey lighten-5"
      ><v-container class="py-12"
        ><v-row
          ><v-col cols="12" md="5"
            ><h3
              class="text-h4 secondary--text text-uppercase font-weight-bold mb-8"
            >
              Konditionen
            </h3>
            <div class="caption">
              <p class="font-weight-bold mb-8">
                Eine Beratung dauert 50 Minuten und kostet für die Frau 50€
              </p>
              <p class="font-weight-bold mb-0">Eine Beratung beinhaltet:</p>
              <ul class="mb-8">
                <li>ein 50 minütiges Beratungsgespräch</li>
                <li>Beratung zur spezifischen Problemstellung der Frau</li>
                <li>Antworten und Ratschläge für die Anliegen der Frau</li>
              </ul>
              <p class="font-weight-bold mb-8">
                Die Sichere Zuflucht gGmbH ist eine gemeinnützige Einrichtung
                und stellt diese Plattform den Frauen und Berater*innen zur
                Verfügung. Wir finanzieren dieses Angebot aus Spenden und mit
                15% des Berater*innen-Honorars.
              </p>
              <nuxt-link to="/faq"
                >Weitere Antworten zu diesem Thema in unseren FAQ</nuxt-link
              >
            </div></v-col
          ><v-col cols="12" md="7"
            ><v-img src="/jede-dritte-frau.jpg" /></v-col></v-row></v-container
    ></v-sheet>
    <v-container>
      <h3 class="text-h4 secondary--text py-8 text-uppercase font-weight-bold">
        so laufen Terminfindung und Beratung ab
      </h3>
      <SharedSteps class="mb-6" />
    </v-container>
    <v-sheet color="grey lighten-5 pt-8">
      <v-container class="text-center">
        <h3
          class="text-h4 text-uppercase secondary--text font-weight-bold mb-1"
        >
          Wir würden uns sehr freuen, wenn sie teil unseres Berater*innen Pools
          werden!
        </h3>
        <h4 class="text-h5 text-uppercase primary--text font-weight-bold">
          Vielen Dank für ihr Engagement!
        </h4>
        <UtilsBtn text="Ja, ich möchte beraten" link="registration/signup" />
      </v-container>
    </v-sheet>
    <v-container>
      <SharedFaq price onlinecoaching forcoaches />
    </v-container>
    <UtilsDonation />
  </div>
</template>

<script>
export default {
  data() {
    return {
      length: 332,
      readmoreText:
        'Eine <a href="https://fra.europa.eu/de/publication/2014/gewalt-gegen-frauen-eine-eu-weite-erhebung-ergebnisse-auf-einen-blick" target="_blank">EU-weite Dunkelfeld-Erhebung</a> hat ergeben, dass<b> 22% der Frauen</b>, die in einer Beziehung mit einem Mann sind oder waren, <b>körperliche Gewalt</b> erfahren haben und das dass zwei von fünf Frauen <b>(43 %)</b> einer Form<b> psychischer Gewalt</b> entweder durch den derzeitigen oder einen früheren Partner ausgesetzt waren. Die Studie “Gewalt gegen Frauen in Paarbeziehungen” vom BMFSFJ zeigt identische Zahlen und Faktenauf. Frauenhäuser und fachspezifische Beratung sind ein essenzieller Teil der Lösung, um diesem Missstand entgegen zu wirken. Aber sie reichen nicht aus. Die Angebote sind regional sehr unterschiedlich. Frauenhäuser und Beratungsstellen bieten ausschließlich lokale Lösungen an – aber das Thema Gewalt bedarf mitunter der Anonymität, die im lokalen Umfeld nicht zuverlässig gegeben ist. Die vorhandenen Online-Angebote zu diesem Thema zielen meist auf Bekanntmachung bestehender Beratungs-Angebote wie z.B. Hotlines ab. Sie bieten nur selten direkt Unterstützung in digitaler Form an.',
      faqs: [
        {
          title:
            'Warum kosten alle Beratungen, unabhängig vom Thema, einheitlich 50€?',
          content: 'Lorem Ipsum',
        },
        {
          title: 'Sichere Zuflucht behält einen prozentualen Anteil. Warum?',
          content: 'Lorem Ipsum',
        },
        {
          title: 'Wie läuft das mit der Bezahlung ab',
          content: 'Lorem Ipsum',
        },
        {
          title: 'Wie ist das mit dem Datenschutz während der Online-Beratung?',
          content: 'Lorem Ipsum',
        },
        {
          title: 'Wer oder was ist RED?',
          content: 'Lorem Ipsum',
        },
        {
          title: 'Wie läuft die Terminfindung ab?',
          content: 'Lorem Ipsum',
        },
        {
          title: 'Mit welcher Auslastung ist erstmal zu rechnen?',
          content: 'Lorem Ipsum',
        },
        {
          title:
            'Wie kann ich meine Leistungen für Sichere Zuflucht steuerlich abrechnen?',
          content: 'Lorem Ipsum',
        },
        {
          title:
            'Ich bin begeistert von diesem Projekt. Kann ich meine Beratung auch erstmal kostenlos anbieten?',
          content: '',
        },
      ],
    }
  },
}
</script>
