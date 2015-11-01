var ontology = '<?xml version="1.0"?>


<!DOCTYPE rdf:RDF [
    <!ENTITY owl "http://www.w3.org/2002/07/owl#" >
    <!ENTITY xsd "http://www.w3.org/2001/XMLSchema#" >
    <!ENTITY rdfs "http://www.w3.org/2000/01/rdf-schema#" >
    <!ENTITY rdf "http://www.w3.org/1999/02/22-rdf-syntax-ns#" >
]>


<rdf:RDF xmlns="http://www.perso.enst.fr/~hle/telecomparistech#"
     xml:base="http://www.perso.enst.fr/~hle/telecomparistech"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <owl:Ontology rdf:about="http://www.perso.enst.fr/~hle/telecomparistech"/>
    


    <!-- 
    ///////////////////////////////////////////////////////////////////////////////////////
    //
    // Object Properties
    //
    ///////////////////////////////////////////////////////////////////////////////////////
     -->

    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#conduct -->

    <owl:ObjectProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#conduct">
        <rdfs:range rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Student"/>
    </owl:ObjectProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#evaluate -->

    <owl:ObjectProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#evaluate">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Lecturer"/>
        <rdfs:range rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
    </owl:ObjectProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#hasEvaluation -->

    <owl:ObjectProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#hasEvaluation">
        <rdfs:range rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
    </owl:ObjectProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#manage -->

    <owl:ObjectProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#manage">
        <rdfs:range rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Student"/>
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#StudyInspector"/>
    </owl:ObjectProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#supervise -->

    <owl:ObjectProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#supervise">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Lecturer"/>
        <rdfs:range rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
    </owl:ObjectProperty>
    


    <!-- 
    ///////////////////////////////////////////////////////////////////////////////////////
    //
    // Data properties
    //
    ///////////////////////////////////////////////////////////////////////////////////////
     -->

    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#academic_year_from -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#academic_year_from">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Student"/>
        <rdfs:range rdf:resource="&xsd;int"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#academic_year_to -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#academic_year_to">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Student"/>
        <rdfs:range rdf:resource="&xsd;int"/>
        <rdfs:subPropertyOf rdf:resource="&owl;topDataProperty"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#baseUE -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#baseUE">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
        <rdfs:subPropertyOf rdf:resource="&owl;topDataProperty"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#cursus -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#cursus">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Student"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#detail -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#detail">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
        <rdfs:subPropertyOf rdf:resource="&owl;topDataProperty"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#domain -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#domain">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#first_name -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#first_name">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#global_score -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#global_score">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
        <rdfs:range rdf:resource="&xsd;double"/>
        <rdfs:subPropertyOf rdf:resource="&owl;topDataProperty"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#last_name -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#last_name">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
        <rdfs:range rdf:resource="&xsd;string"/>
        <rdfs:subPropertyOf rdf:resource="&owl;topDataProperty"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#presentation_eval -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#presentation_eval">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#project_group -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#project_group">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;boolean"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#report_eval -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#report_eval">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#semester -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#semester">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
        <rdfs:subPropertyOf rdf:resource="&owl;topDataProperty"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#slot -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#slot">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#title -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#title">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#type_project -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#type_project">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#work_eval -->

    <owl:DatatypeProperty rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#work_eval">
        <rdfs:domain rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
        <rdfs:range rdf:resource="&xsd;string"/>
    </owl:DatatypeProperty>
    


    <!-- 
    ///////////////////////////////////////////////////////////////////////////////////////
    //
    // Classes
    //
    ///////////////////////////////////////////////////////////////////////////////////////
     -->

    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#Conference -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Conference"/>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#Evaluation -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#Lecturer -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Lecturer">
        <rdfs:subClassOf rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
    </owl:Class>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#Person -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#Project -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#Student -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Student">
        <rdfs:subClassOf rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
    </owl:Class>
    


    <!-- http://www.perso.enst.fr/~hle/telecomparistech#StudyInspector -->

    <owl:Class rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#StudyInspector">
        <rdfs:subClassOf rdf:resource="http://www.perso.enst.fr/~hle/telecomparistech#Person"/>
    </owl:Class>
    


    <!-- 
    ///////////////////////////////////////////////////////////////////////////////////////
    //
    // General axioms
    //
    ///////////////////////////////////////////////////////////////////////////////////////
     -->

    <rdf:Description>
        <rdf:type rdf:resource="&owl;AllDisjointClasses"/>
        <owl:members rdf:parseType="Collection">
            <rdf:Description rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Conference"/>
            <rdf:Description rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Evaluation"/>
            <rdf:Description rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Lecturer"/>
            <rdf:Description rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Project"/>
            <rdf:Description rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#Student"/>
            <rdf:Description rdf:about="http://www.perso.enst.fr/~hle/telecomparistech#StudyInspector"/>
        </owl:members>
    </rdf:Description>
</rdf:RDF>



<!-- Generated by the OWL API (version 3.4.2) http://owlapi.sourceforge.net -->

';