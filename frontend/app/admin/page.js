"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Edit, Trash2, Plus, Search } from "lucide-react";

const API_URL = "http://localhost:4000/api/cantine";

export default function AdminPanel() {
  const [inscriptions, setInscriptions] = useState([]);
  const [filteredInscriptions, setFilteredInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    classe: "",
    email_parent: "",
    regime_alimentaire: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchInscriptions();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredInscriptions(inscriptions);
    } else {
      const filtered = inscriptions.filter(
        (inscription) =>
          inscription.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inscription.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inscription.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inscription.email_parent.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInscriptions(filtered);
    }
  }, [searchTerm, inscriptions]);

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setInscriptions(data);
      setFilteredInscriptions(data);
      setMessage({ type: "", text: "" });
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors du chargement des données" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (inscription) => {
    setSelectedInscription(inscription);
    setFormData({
      nom: inscription.nom,
      prenom: inscription.prenom,
      classe: inscription.classe,
      email_parent: inscription.email_parent,
      regime_alimentaire: inscription.regime_alimentaire
    });
    setIsDialogOpen(true);
    setMessage({ type: "", text: "" });
  };

  const handleOpenDeleteDialog = (inscription) => {
    setSelectedInscription(inscription);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedInscription(null);
    setFormData({
      nom: "",
      prenom: "",
      classe: "",
      email_parent: "",
      regime_alimentaire: ""
    });
    setMessage({ type: "", text: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${selectedInscription.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la modification");
      }

      setMessage({ type: "success", text: "Inscription modifiée avec succès" });
      handleCloseDialog();
      fetchInscriptions();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedInscription.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setMessage({ type: "success", text: "Inscription supprimée avec succès" });
      handleCloseDialog();
      fetchInscriptions();
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold">Panel d'Administration</CardTitle>
                <CardDescription className="mt-2">
                  Gérez les inscriptions à la cantine scolaire
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={fetchInscriptions}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Message Alert */}
        {message.text && (
          <Card className={message.type === "success" ? "border-green-500" : "border-destructive"}>
            <CardContent className="pt-6">
              <div
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-destructive"
                }`}
              >
                {message.text}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Stats Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, prénom, classe ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {filteredInscriptions.length} inscription{filteredInscriptions.length > 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Inscriptions</CardTitle>
            <CardDescription>
              Cliquez sur une ligne pour voir les détails ou utiliser les boutons d'action
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement...</span>
              </div>
            ) : filteredInscriptions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucun résultat trouvé" : "Aucune inscription trouvée"}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Email Parent</TableHead>
                      <TableHead>Régime</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInscriptions.map((inscription) => (
                      <TableRow key={inscription.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{inscription.id}</TableCell>
                        <TableCell>{inscription.nom}</TableCell>
                        <TableCell>{inscription.prenom}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{inscription.classe}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {inscription.email_parent}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {inscription.regime_alimentaire}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(inscription.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditDialog(inscription)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(inscription)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier l'inscription</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'inscription #{selectedInscription?.id}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Nom de l'enfant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                      placeholder="Prénom de l'enfant"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classe">Classe *</Label>
                    <Input
                      id="classe"
                      name="classe"
                      value={formData.classe}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: CE1, CE2, CM1..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_parent">Email Parent *</Label>
                    <Input
                      id="email_parent"
                      name="email_parent"
                      type="email"
                      value={formData.email_parent}
                      onChange={handleInputChange}
                      required
                      placeholder="parent@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regime_alimentaire">Régime Alimentaire *</Label>
                  <Input
                    id="regime_alimentaire"
                    name="regime_alimentaire"
                    value={formData.regime_alimentaire}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: sans porc, végétarien, sans allergènes..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'inscription de{" "}
                <strong>
                  {selectedInscription?.prenom} {selectedInscription?.nom}
                </strong>{" "}
                (ID: {selectedInscription?.id}) ?
                <br />
                <span className="text-destructive">Cette action est irréversible.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
